pipeline {
  agent any

  environment {
    BASE_URL = 'https://www.saucedemo.com'
    PASSWORD = credentials('swaglabs_password')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install'
      }
    }

    stage('Run Playwright tests') {
      steps {
        sh 'npx playwright test'
      }
    }
  }

  post {
    always {
      catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
        junit 'test-results/playwright-junit.xml'
      }
      archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true, allowEmptyArchive: true
      archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, allowEmptyArchive: true
    }
  }
}