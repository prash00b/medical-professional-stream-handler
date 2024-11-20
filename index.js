const util = require('util');
const stream = require('stream');
const { Readable } = stream;
const zlib = require('zlib');
const pipeline = util.promisify(stream.pipeline);

const {
	BedrockRuntimeClient,
	InvokeModelWithResponseStreamCommand,
} = require('@aws-sdk/client-bedrock-runtime'); 

const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });


function parseBase64(message) {
	return JSON.parse(Buffer.from(message, 'base64').toString('utf-8'));
}

exports.handler = awslambda.streamifyResponse(
    async (event, responseStream, _context) => {
    const data_from_event = JSON.parse(event.body);
        
        const a = event.rawPath;
        let params;
        if (a === "/1") {
            params = {
                modelId: "anthropic.claude-instant-v1",
                accept: "application/json",
                contentType: "application/json",
                body: JSON.stringify({
                    prompt: `\n\nHuman:You are a medical professional.
                    Your goal is to read the patient's medical history <json>${JSON.stringify(data_from_event)}</json> and summarize it in one paragraph for other doctors to understand.
                    Provide the professional summary of the patient history without introductory phrases.
                    \n\nAssistant:`,
                    max_tokens_to_sample: 900,
                    temperature: 0.9,
                    top_k: 225,
                    top_p: 0.88,
                    stop_sequences: ["\n\nHuman:"],
                    anthropic_version: "bedrock-2023-05-31",
                }),
            };
        } else {
            params = {
                modelId: "anthropic.claude-instant-v1",
                accept: "application/json",
                contentType: "application/json",
                body: JSON.stringify({
                    prompt: `\n\nHuman:
                    You are a medical professional.
                    Your goal is to recommend preventative measures or careplans for a patient based on concerns in their medical history. 
                    Here is their medical history <json>${JSON.stringify(data_from_event)}</json>.
                    Recommend preventative measures for the patient based on their medical history without introductory phrases.
                    Provide 5 in-depth and unique preventative measures. Include relevant citations and a weblink at the end of each preventative measure.
                    Each preventative measure will be on a new line with a number 1-5 following the format of "title:".
                    \n\nAssistant:`,
                    max_tokens_to_sample: 900,
                    temperature: 0.9,
                    top_k: 225,
                    top_p: 0.88,
                    stop_sequences: ["\n\nHuman:"],
                    anthropic_version: "bedrock-2023-05-31",
                }),
            };
        }

        console.log(params);
        const command = new InvokeModelWithResponseStreamCommand(params);
        const response = await bedrock.send(command);
        
        const chunks = [];
        
        // Asynchronously iterate over the chunks in the response body
        for await (const chunk of response.body) {
            // Parse the base64-encoded data in the chunk
            const parsed = parseBase64(chunk.chunk.bytes);
            
            // Push the parsed completion to the chunked array
            chunks.push(parsed.completion);
            
            // Write the parsed completion to the response stream
            responseStream.write(parsed.completion);
        }
        // End of response body iteration
        responseStream.end();
    }
);




