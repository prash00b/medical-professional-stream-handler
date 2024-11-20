# Medical Professional Stream Handler

This project implements a Lambda function to process and respond to medical data using AWS Bedrock and the Claude-instant-v1 model. The function is designed to provide professional medical summaries and preventative care recommendations based on a patient's medical history.

---

## Features

- **Summarization**: Generates a concise summary of a patient's medical history for professional use.
- **Preventative Measures**: Recommends tailored preventative measures with citations and weblinks.
- **Streaming Response**: Uses AWS Bedrock's streaming capabilities for real-time response delivery.

---

## Prerequisites

- Node.js
- AWS SDK for JavaScript v3
- Access to AWS Bedrock with Claude-instant-v1
- AWS Lambda with the `awslambda.streamifyResponse` module enabled

---

## Setup

1. **Install Dependencies**:
   Run the following command to install necessary modules:
   ```bash
   npm install @aws-sdk/client-bedrock-runtime
   npm install util zlib
