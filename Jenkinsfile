pipeline {
    agent any

    stages {
        stage('Check Versions') {
            steps {
                sh '''
                node -v
                npm -v
                git --version
                which node
                which npm
                which pm2
                '''
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy With PM2') {
            steps {
                dir('backend') {
                    sh '''
                    /usr/bin/pm2 restart note-apps --update-env || /usr/bin/pm2 start server.js --name note-apps
                    /usr/bin/pm2 save
                    /usr/bin/pm2 list
                    sleep 3
                    curl -I http://localhost:5000
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully'
        }

        failure {
            echo 'Deployment failed'
        }
    }
}