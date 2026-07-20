pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'SonarQube analysis will be configured next.'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t devops-project .'
            }
        }
    }
}