pipeline {
  agent any

  environment {
    BASE_URL = 'https://www.saucedemo.com'
    PASSWORD = credentials('swaglabs_password')
    API_KEY = credentials('api_key')
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

    stage('Run Smoke Tests') {
      steps {
        sh 'npx playwright test --grep @smoke'
      }
    }

    stage('Run Regression Tests') {
      when {
        expression {
          return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master'
        }
      }
      steps {
        sh 'npx playwright test --grep @regression'
      }
    }

    stage('Run Accessibility Tests') {
      when {
        expression {
          return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master'
        }
      }
      steps {
        sh 'npx playwright test --grep @accessibility'
      }
    }

    stage('Run Security Tests') {
      when {
        expression {
          return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master'
        }
      }
      steps {
        sh 'npx playwright test --grep @security'
      }
    }

    stage('Run API Tests') {
      steps {
        sh 'npx playwright test --grep @api'
      }
    }

    stage('Run Network Tests') {
      steps {
        sh 'npx playwright test --grep @network'
      }
    }

    stage('Run SEO Tests') {
      steps {
        sh 'npx playwright test --grep @seo'
      }
    }
  }

  post {
    always {
      script {
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          junit 'test-results/playwright-junit.xml'
        }
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true, allowEmptyArchive: true
          archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, allowEmptyArchive: true
        }
      }
    }
  }
}