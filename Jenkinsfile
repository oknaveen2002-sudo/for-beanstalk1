pipeline {
    agent any

    tools { nodejs 'node26' }   // Configure in Manage Jenkins > Tools (NodeJS plugin)

    triggers { githubPush() }   // Fires on GitHub webhook

    environment {
        AWS_DEFAULT_REGION = 'ap-south-1'
        EB_APP             = 'my-app'
        EB_ENV             = 'My-app-env'
        S3_BUCKET          = 'my-eb-deploy'   // <-- change me
        VERSION_LABEL      = "build-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install') {
            steps { sh 'npm ci || npm install' }
        }

        stage('Test') {
            steps { sh 'npm test' }
        }

        stage('Package') {
            steps {
                sh '''
                    rm -f app.zip
                    zip -r app.zip . -x "node_modules/*" ".git/*" "test/*" "app.zip" "Jenkinsfile"
                '''
                archiveArtifacts artifacts: 'app.zip', fingerprint: true
            }
        }

        stage('Deploy to Elastic Beanstalk') {
          // Use a Multibranch Pipeline; remove this line for a plain Pipeline job
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',
                                  credentialsId: 'aws-creds']]) {
                    sh '''
                        aws s3 cp app.zip s3://$S3_BUCKET/$EB_APP/$VERSION_LABEL.zip

                        aws elasticbeanstalk create-application-version \
                          --application-name $EB_APP \
                          --version-label $VERSION_LABEL \
                          --source-bundle S3Bucket=$S3_BUCKET,S3Key=$EB_APP/$VERSION_LABEL.zip

                        aws elasticbeanstalk update-environment \
                          --environment-name $EB_ENV \
                          --version-label $VERSION_LABEL

                        aws elasticbeanstalk wait environment-updated \
                          --environment-names $EB_ENV
                    '''
                }
            }
        }
    }

    post {
        success { echo "Deployed ${VERSION_LABEL} to ${EB_ENV}" }
        failure { echo 'Pipeline failed - check the stage logs above.' }
        always  { cleanWs() }
    }
}
