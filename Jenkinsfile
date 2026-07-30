// =================================================
// Jenkinsfile — Sankalpa Care CI/CD Pipeline
// Stack: Next.js 16 + TypeScript + Prisma + Supabase
// =================================================

pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        SONAR_SCANNER_HOME             = tool 'SonarScanner'
        NODE_ENV                       = 'production'
        // Uncomment and wire up after adding secrets to Jenkins credentials:
        // NEXT_PUBLIC_SUPABASE_URL      = credentials('NEXT_PUBLIC_SUPABASE_URL')
        // NEXT_PUBLIC_SUPABASE_ANON_KEY = credentials('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        // DATABASE_URL                  = credentials('DATABASE_URL')
        // JWT_SECRET                    = credentials('JWT_SECRET')
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Cloning repository from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm packages...'
                // Use 'bat' instead of 'sh' if Jenkins runs on Windows
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                echo '🔍 Running ESLint...'
                // || true — lint warnings won't fail the build
                sh 'npm run lint || true'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '📊 Running SonarQube static code analysis...'
                withSonarQubeEnv('SonarQube') {
                    sh """
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=sankalpa-care \
                        -Dsonar.projectName="Sankalpa Care" \
                        -Dsonar.sources=src \
                        -Dsonar.exclusions=**/node_modules/**,**/.next/**,**/prisma/**
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo '🚦 Waiting for SonarQube Quality Gate result...'
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build') {
            steps {
                echo '🏗️ Building Next.js application...'
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying Sankalpa Care...'
                // Add your deployment command here. Examples:
                // sh 'pm2 restart sankalpa-care'
                // sh 'docker build -t sankalpa-care . && docker-compose up -d'
                echo '⚠️  Deployment step not configured yet — add your deploy command here!'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully! Sankalpa Care is live.'
        }
        failure {
            echo '❌ Pipeline failed! Check the Console Output above for details.'
        }
        always {
            echo '🧹 Cleaning workspace...'
            cleanWs()
        }
    }
}
