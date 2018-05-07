@Library('deploy')
import deploy
deployLib = new deploy()

node {
    def commitHashShort, committer, releaseVersion
    def app = "pam-stillingsok"
    def repo = "navikt"
    def appConfig = "nais.yaml"
    def dockerRepo = "repo.adeo.no:5443"
    def groupId = "nais"
    def environment = 't1'
    def zone = 'sbs'
    def namespace = 'default'
    def production = "${env.DEPLOY_TO_PRODUCTION}"
    def rollback_version = "${env.ROLLBACK_VERSION}"
    def color

    stage("Initialization") {
        cleanWs()
        withCredentials([string(credentialsId: 'navikt-ci-oauthtoken', variable: 'token')]) {
            withEnv(['HTTPS_PROXY=http://webproxy-utvikler.nav.no:8088']) {
                sh(script: "git clone https://${token}:x-oauth-basic@github.com/${repo}/${app}.git .")
            }
        }
        commitHash = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
        commitHashShort = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        commitUrl = "https://github.com/${repo}/${app}/commit/${commitHash}"
        committer = sh(script: 'git log -1 --pretty=format:"%an"', returnStdout: true).trim()
        committerEmail = sh(script: 'git log -1 --pretty=format:"%ae"', returnStdout: true).trim()
        changelog = sh(script: 'git log `git describe --tags --abbrev=0`..HEAD --oneline', returnStdout: true)
        majorMinorVersion = sh(script: 'node ./scripts/package-version.js', returnStdout: true).trim()
        releaseVersion = "${majorMinorVersion}.${env.BUILD_NUMBER}-${commitHashShort}"
        echo "release version: ${releaseVersion}"
    }

    if (!rollback_version.trim().equals("")) {
        stage("Rollback production") {
            echo "rolling back production to: ${rollback_version}"
            deployToProduction(app, rollback_version, zone, namespace, committer)
        }
    }
    else {
        stage("Build & publish") {
            withEnv(['HTTPS_PROXY=http://webproxy-utvikler.nav.no:8088', 'HTTP_PROXY=http://webproxy-utvikler.nav.no:8088', 'NO_PROXY=localhost,127.0.0.1,maven.adeo.no', 'NODE_TLS_REJECT_UNAUTHORIZED=0', 'PORT=8081']) {
                sh "npm install"
            }
            sh "npm run build"
            sh "docker build --build-arg version=${releaseVersion} --build-arg app_name=${app} -t ${dockerRepo}/${app}:${releaseVersion} ."
            withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                sh "docker login -u ${env.USERNAME} -p ${env.PASSWORD} ${dockerRepo} && docker push ${dockerRepo}/${app}:${releaseVersion}"
                sh "curl --fail -v -u ${env.USERNAME}:${env.PASSWORD} --upload-file ${appConfig} https://repo.adeo.no/repository/raw/${groupId}/${app}/${releaseVersion}/nais.yaml"
            }
        }

        stage("Deploy to TEST") {
            callback = "${env.BUILD_URL}input/Deploy/"

            def deploy = deployLib.deployNaisApp(app, releaseVersion, environment, zone, namespace, callback, committer).key

            try {
                timeout(time: 15, unit: 'MINUTES') {
                    input id: 'deploy', message: "Check status here:  https://jira.adeo.no/browse/${deploy}"
                }

                color = 'good'
                GString message = "${app} version ${releaseVersion} has been deployed to pre-prod."
                slackSend color: color, channel: '#pam_bygg', message: message, teamDomain: 'nav-it', tokenCredentialId: 'pam-slack'

            } catch (Exception e) {
                color = 'warning'
                GString message = "Build ${releaseVersion} of ${app} could not be deployed to pre-prod"
                slackSend color: color, channel: '#pam_bygg', message: message, teamDomain: 'nav-it', tokenCredentialId: 'pam-slack'
                throw new Exception("Deploy feilet :( \n Se https://jira.adeo.no/browse/" + deploy + " for detaljer", e)
            }
        }

        stage("Run functional acceptance tests") {
            // tests does not work, because of bigip problems or firewall problems
//          withEnv(['HTTP_PROXY=http://webproxy-utvikler.nav.no:8088', 'NO_PROXY=adeo.no']) {
//              try {
//                    qaDir = "./qa"
//                  sh "cd ${qaDir} && npm install --chromedriver_filepath=/usr/local/chromedriver/chromedriver_linux64.zip"
//                  sh "cd ${qaDir} && npm run-script cucumber-jenkins "
//              } catch (Exception e) {
//                  sh "cd ${qaDir} && npm run-script cucumber-report "
//                  publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'qa/reports', reportFiles: 'cucumber_report.html', reportName: 'Nightwatch Report'])
//                  throw new Exception("Nightwatch-tester feilet, se Nightwatch-rapport for detaljer", e)
//              }

//              sh "cd ${qaDir} && npm run-script cucumber-report "
//              publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'qa/reports', reportFiles: 'cucumber_report.html', reportName: 'Nightwatch Report'])
//        }
        }
        if (production.trim().equals("true")) {
            stage("PRODUCTION") {
                deployToProduction(app, releaseVersion, zone, namespace, committer)
            }
            stage("Tag and bump version") {
                withEnv(['HTTPS_PROXY=http://webproxy-utvikler.nav.no:8088']) {
                    withCredentials([string(credentialsId: 'navikt-ci-oauthtoken', variable: 'token')]) {
                        sh ("git tag -a ${releaseVersion} -m ${releaseVersion}")
                        sh ("git push https://${token}:x-oauth-basic@github.com/${repo}/${app}.git --tags")
                    }
                }
                newDevVersion = sh(script: 'npm version --no-git-tag-version minor', returnStdout: true).trim()
                withEnv(['HTTPS_PROXY=http://webproxy-utvikler.nav.no:8088']) {
                    withCredentials([string(credentialsId: 'navikt-ci-oauthtoken', variable: 'token')]) {
                        sh ("git commit -am \"updated to ${newDevVersion} after deployed to production by ${committer}\"")
                        sh ("git push origin master")
                    }
                }
            }
        }
    }
}
def deployToProduction(app, releaseVersion, zone, namespace, committer) {
    echo "Deploying ${releaseVersion} to production"
    callback = "${env.BUILD_URL}input/Deploy/"
    def deploy = deployLib.deployNaisApp(app, releaseVersion, 'p', zone, namespace, callback, committer, false).key
    try {
        timeout(time: 15, unit: 'MINUTES') {
            input id: 'deploy', message: "Check status here:  https://jira.adeo.no/browse/${deploy}"
        }
        color = 'good'
        GString message = "${app} version ${releaseVersion} has been deployed to production."
        slackSend color: color, channel: '#pam_bygg', message: message, teamDomain: 'nav-it', tokenCredentialId: 'pam-slack'
    }
    catch (Exception e) {
        color = 'danger'
        GString message = "Build ${releaseVersion} of ${app} could not be deployed to production"
        slackSend color: color, channel: '#pam_bygg', message: message, teamDomain: 'nav-it', tokenCredentialId: 'pam-slack'
        throw new Exception("Deploy feilet :( \n Se https://jira.adeo.no/browse/" + deploy + " for detaljer", e)
    }
}


