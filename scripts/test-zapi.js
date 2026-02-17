// Script de teste Z-API
const instanceId = "3EEE391BBB58B1CE4D795A60F245B8AE";
const token = "7DAAB4458FF5EB131A02A36A";
const clientToken = "F063e1a53db3c4061bd9b8dbf745f7997S";
const phone = "5512988888888"; // Troca pelo teu número
const message = "Teste Z-API - Litoral Norte Imóveis";

async function testSend() {
  const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': clientToken,
      },
      body: JSON.stringify({ phone, message }),
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro:', error);
  }
}

testSend();
