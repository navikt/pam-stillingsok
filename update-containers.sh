#!/usr/bin/env bash


# Define an array of containers
CONTAINERS=("pam-aduser" "pam-geografi" "pam-search-api")

# Function to get the latest tag for a container
get_latest_tag() {
  local container=$1
  TAG_OUTPUT=$(gcloud container images list-tags europe-north1-docker.pkg.dev/nais-management-233d/teampam/$container \
    --sort-by=~tags --filter="tags:* AND NOT tags:sha256*" --limit=10 --format="value(tags)" 2>&1 | grep -v "WARNING" | cut -d "," -f2)

  if echo "$TAG_OUTPUT" | grep -q "Reauthentication required"; then
    echo "Authentication required for $container. Running gcloud auth login..."
    while ! gcloud auth login; do
      echo "gcloud auth login failed for $container. Please check your credentials and try again."
      read -p "Press enter to retry or Ctrl+C to exit..."
    done
    
    # Retry fetching the latest image tag after authentication
    TAG_OUTPUT=$(gcloud container images list-tags europe-north1-docker.pkg.dev/nais-management-233d/teampam/$container \
      --sort-by=~tags --filter="tags:* AND NOT tags:sha256*" --limit=10 --format="value(tags)" 2>&1 | grep -v "WARNING" | cut -d "," -f2)
    
    if [[ -z "$TAG_OUTPUT" ]]; then
      echo "Failed to retrieve image tags for $container even after authentication. Exiting."
      exit 1
    fi
  fi

  # Extract the highest image tag (first in the list after filtering warnings)
  HIGHEST_TAG=$(echo "$TAG_OUTPUT" | head -n1 | tr -d '[:space:]')
  echo "$HIGHEST_TAG"
}

# Function to extract current tag from docker-compose.yml
get_current_tag() {
  local container=$1
  CURRENT_TAG=$(grep "image: europe-north1-docker.pkg.dev/nais-management-233d/teampam/$container:" ./docker-compose.yml | sed -E 's|image: europe-north1-docker.pkg.dev/nais-management-233d/teampam/'$container':([0-9.]+)|\1|')
  echo "$CURRENT_TAG"
}

# Function to update docker-compose.yml using sed
update_docker_compose() {
  local container=$1
  local highest_tag=$2
  local os_type=$3

  echo "Updating docker-compose.yml for $container to use tag $highest_tag"
  
  # Proceed with the update depending on OS type
  if [[ "$os_type" == "Darwin"* ]]; then
    # macOS uses '-i '' for in-place editing
    sed -i '' "s|image: europe-north1-docker.pkg.dev/nais-management-233d/teampam/$container:[0-9.]*|image: europe-north1-docker.pkg.dev/nais-management-233d/teampam/$container:$highest_tag|" ./docker-compose.yml
  elif [[ "$os_type" == "Linux"* ]]; then
    # Linux uses '-i' for in-place editing
    sed -i "s|image: europe-north1-docker.pkg.dev/nais-management-233d/teampam/$container:[0-9.]*|image: europe-north1-docker.pkg.dev/nais-management-233d/teampam/$container:$highest_tag|" ./docker-compose.yml
  elif [[ "$os_type" == "MINGW"* || "$os_type" == "CYGWIN"* || "$os_type" == "MSYS"* ]]; then
    # Windows (Git Bash) uses '-i' with a file extension for in-place editing
    sed -i"" "s|image: europe-north1-docker.pkg.dev/nais-management-233d/teampam/$container:[0-9.]*|image: europe-north1-docker.pkg.dev/nais-management-233d/teampam/$container:$highest_tag|" ./docker-compose.yml
  fi
  echo "docker-compose.yml updated to use tag $highest_tag for $container."
}

# Loop over each container and check if an update is needed
for container in "${CONTAINERS[@]}"; do
  CURRENT_TAG=$(get_current_tag "$container")
  HIGHEST_TAG=$(get_latest_tag "$container")

  # Display both the current and highest available tag
  echo "Current tag for $container: $CURRENT_TAG"
  echo "Highest available tag for $container: $HIGHEST_TAG"

  # Compare the tags using awk to check if the highest tag is greater than the current tag
  if [[ $(echo "$HIGHEST_TAG $CURRENT_TAG" | awk '{ if ($1 > $2) print 1; else print 0 }') -eq 1 ]]; then
    read -p "A new image tag ($HIGHEST_TAG) is available for $container. Do you want to update it in docker-compose.yml? (y/n): " update_choice
    if [[ "$update_choice" == "y" ]]; then
      # Get the OS type (important for Windows compatibility)
      OS_TYPE=$(uname)

      # Call the function to update docker-compose.yml based on OS type
      update_docker_compose "$container" "$HIGHEST_TAG" "$OS_TYPE"
    fi
  else
    echo "No update needed for $container. The tags are the same."
  fi
done
