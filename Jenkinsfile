pipeline {
    agent any

    stages {
        stage('Environment Check') {
            steps {
                sh 'echo PATH=$PATH'
                sh 'which node || true'
                sh 'node -v || true'
                sh 'which npm || true'
                sh 'npm -v || true'
                sh 'which git || true'
                sh 'git --version || true'
            }
        }
    }
}