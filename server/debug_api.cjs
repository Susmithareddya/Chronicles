// Quick debug script to test ElevenLabs API directly
const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.VITE_ELEVEN_LABS_API_KEY;

console.log('🧪 Testing ElevenLabs API directly...');
console.log(`🔑 API Key: ${API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT SET'}`);

async function testAPI() {
    if (!API_KEY || API_KEY === 'your-elevenlabs-api-key-here') {
        console.log('❌ API key not properly configured');
        return;
    }

    try {
        // Test 1: Get user info (basic auth test)
        console.log('\n1️⃣ Testing authentication...');
        const userResponse = await fetch('https://api.elevenlabs.io/v1/user', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!userResponse.ok) {
            console.log(`❌ Auth failed: ${userResponse.status} ${userResponse.statusText}`);
            const errorText = await userResponse.text();
            console.log('Error details:', errorText);
            return;
        }

        const userData = await userResponse.json();
        console.log('✅ Authentication successful');
        console.log(`   User: ${userData.subscription?.character_count || 'N/A'} characters available`);

        // Test 2: List agents
        console.log('\n2️⃣ Testing agents endpoint...');
        const agentsResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!agentsResponse.ok) {
            console.log(`❌ Agents request failed: ${agentsResponse.status} ${agentsResponse.statusText}`);
            const errorText = await agentsResponse.text();
            console.log('Error details:', errorText);
            return;
        }

        const agentsData = await agentsResponse.json();
        console.log(`✅ Found ${agentsData.agents ? agentsData.agents.length : 0} agents`);

        if (agentsData.agents && agentsData.agents.length > 0) {
            console.log('\n📋 Available agents:');
            agentsData.agents.forEach((agent, idx) => {
                console.log(`   ${idx + 1}. ID: ${agent.id || agent.agent_id}`);
                console.log(`      Name: ${agent.name || 'Unnamed'}`);
                console.log(`      Created: ${agent.created_at || 'N/A'}`);
                console.log(`      Status: ${agent.status || 'N/A'}`);
                console.log('');
            });

            // Test 3: Try to get conversations for the first agent
            const firstAgent = agentsData.agents[0];
            const agentId = firstAgent.id || firstAgent.agent_id;

            console.log(`3️⃣ Testing conversations for agent: ${agentId}...`);
            const conversationsResponse = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}/conversations`, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!conversationsResponse.ok) {
                console.log(`❌ Conversations request failed: ${conversationsResponse.status} ${conversationsResponse.statusText}`);
                const errorText = await conversationsResponse.text();
                console.log('Error details:', errorText);
            } else {
                const conversationsData = await conversationsResponse.json();
                console.log(`✅ Found ${conversationsData.conversations ? conversationsData.conversations.length : 0} conversations for this agent`);
            }
        } else {
            console.log('⚠️  No agents found. You might need to create an agent first.');
        }

    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
}

testAPI();