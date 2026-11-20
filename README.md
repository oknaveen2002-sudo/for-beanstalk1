# GitHub -> Jenkins -> Elastic Beanstalk Practice Pipeline

Flow: `git push` -> GitHub webhook -> Jenkins (install, test, zip) -> S3 -> Elastic Beanstalk.

## 1. Run locally
```bash
npm install && npm test && npm start   # http://localhost:8080
```

## 2. GitHub
```bash
git init && git add . && git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/<you>/eb-pipeline-demo.git
git push -u origin main
```

## 3. AWS setup
1. Create an S3 bucket for artifacts (put its name in `Jenkinsfile` -> `S3_BUCKET`).
2. Elastic Beanstalk -> Create application `eb-pipeline-demo`
   - Platform: Node.js, Sample application
   - Environment name: `eb-pipeline-demo-env`
3. Create an IAM user for Jenkins with: `AWSElasticBeanstalkFullAccess` + S3 access to your bucket
   (s3:PutObject, s3:GetObject). Generate an access key.

## 4. Jenkins setup
1. Install on a server with `zip` and AWS CLI v2 (`sudo apt install zip unzip`).
2. Plugins: Pipeline, Git, GitHub, NodeJS, Credentials Binding, AWS Credentials.
3. Manage Jenkins > Tools > add NodeJS installation named `node18`.
4. Manage Jenkins > Credentials > add "AWS Credentials" with ID `aws-creds`.
5. New Item > Multibranch Pipeline > Source: GitHub repo > Script Path `Jenkinsfile`.

## 5. Webhook
GitHub repo > Settings > Webhooks > Add:
- Payload URL: `http://<jenkins-host>:8080/github-webhook/`
- Content type: `application/json`, event: Just the push event

## 6. Practice
- Edit the message in `app.js`, push to `main`, watch Jenkins deploy it.
- Break a test on purpose and see the pipeline stop before deploy.
- Try: add a `develop` branch deploying to a second EB environment, add a manual
  `input` approval stage, or add Slack notifications in `post {}`.
- Roll back by running `aws elasticbeanstalk update-environment` with an older `--version-label`.
- add new line
