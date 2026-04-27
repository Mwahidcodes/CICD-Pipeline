pipeline {
    agent any

    stages {
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
                    pm2 restart note-app || pm2 start server.js --name note-app
                    pm2 save
                    '''
                }
            }
        }
    }
}