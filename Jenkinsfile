@Library('deploy')
import deploy

def deployLib = new deploy()

node {
    def commitHashShort, committer, releaseVersion
    def app = "pam-stillingsok"
    def appConfig = "nais.yaml"
    def dockerRepo = "docker.adeo.no:5000"
    def groupId = "nais"
    def environment = 't1'
    def zone = 'sbs'
    def namespace = 'default'

    stage("Checkout") {
        deleteDir()
        checkout scm

        commitHashShort = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        committer = sh(script: 'git log -1 --pretty=format:"%an"', returnStdout: true).trim()

        majorMinorVersion = sh(script: 'node ./scripts/package-version.js', returnStdout: true).trim()
        releaseVersion = "${majorMinorVersion}.${env.BUILD_NUMBER}-${commitHashShort}"
        echo "release version: ${releaseVersion}"
    }

    stage("npm install") {
        withEnv(['HTTPS_PROXY=http://webproxy-utvikler.nav.no:8088', 'HTTP_PROXY=http://webproxy-utvikler.nav.no:8088', 'NO_PROXY=localhost,127.0.0.1,maven.adeo.no', 'NODE_TLS_REJECT_UNAUTHORIZED=0', 'PORT=8081']) {
            sh "npm install"
        }
    }

    stage("Build") {
        sh "npm run build"
        sh "docker build --build-arg version=${releaseVersion} --build-arg app_name=${app} -t ${dockerRepo}/${app}:${releaseVersion} ."
    }

    stage("Tag") {
        sh("git tag -a ${releaseVersion} -m ${releaseVersion}")
        sh("git push --tags")
    }

    stage("Publish") {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'ae2a1279-c7c5-4ef8-9973-23590a8924a2', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
            sh "docker push ${dockerRepo}/${app}:${releaseVersion}"
            sh "curl --fail -v -u $USERNAME:$PASSWORD --upload-file ${appConfig} https://repo.adeo.no/repository/raw/${groupId}/${app}/${releaseVersion}/nais.yaml"
        }
    }

    stage('Deploy to preprod') {
        callback = "${env.BUILD_URL}input/Deploy/"
        def deploy = deployLib.deployNaisApp(app, releaseVersion, environment, zone, namespace, callback, committer).key
        try {
            timeout(time: 15, unit: 'MINUTES') {
                input id: 'deploy', message: "Check status here:  https://jira.adeo.no/browse/${deploy}"
            }
        } catch (Exception e) {
            throw new Exception("Deploy feilet :( \n Se https://jira.adeo.no/browse/" + deploy + " for detaljer", e)

        }
    }

    stage("Run functional acceptance tests") {
        withEnv(['HTTP_PROXY=http://webproxy-utvikler.nav.no:8088', 'NO_PROXY=adeo.no']) {
            try {
                qaDir = "./qa"
                sh "cd ${qaDir} && npm install --chromedriver_filepath=/usr/local/chromedriver/chromedriver_linux64.zip"
                sh "cd ${qaDir} && npm run-script cucumber-jenkins "
            } catch (Exception e) {
                sh "cd ${qaDir} && npm run-script cucumber-report "
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'qa/reports', reportFiles: 'cucumber_report.html', reportName: 'Nightwatch Report'])
                throw new Exception("Nightwatch-tester feilet, se Nightwatch-rapport for detaljer", e)
            }

            sh "cd ${qaDir} && npm run-script cucumber-report "
            publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'qa/reports', reportFiles: 'cucumber_report.html', reportName: 'Nightwatch Report'])
        }
    }

    stage('Deploy to prod') {
        callback = "${env.BUILD_URL}input/Deploy/"
        def deploy = deployLib.deployNaisApp(app, releaseVersion, 'p', zone, namespace, callback, committer).key
        try {
            timeout(time: 15, unit: 'MINUTES') {
                input id: 'deploy', message: "Check status here:  https://jira.adeo.no/browse/${deploy}"
            }
        } catch (Exception e) {
            throw new Exception("Deploy feilet :( \n Se https://jira.adeo.no/browse/" + deploy + " for detaljer", e)
        }
    }

}
