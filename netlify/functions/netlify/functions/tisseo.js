exports.handler = async function(event) {
  try {
    const params = new URLSearchParams(event.queryStringParameters || {});
    const url = "https://api.tisseo.fr/v2/stops_schedules.json?" + params.toString();

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json"
      }
    });

    const body = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "Proxy error",
        details: error.message
      })
    };
  }
};