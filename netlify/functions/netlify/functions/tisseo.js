exports.handler = async function(event) {

  const params = new URLSearchParams(event.queryStringParameters)

  const url =
    "https://api.tisseo.fr/v2/stops_schedules.json?" +
    params.toString()

  try {

    const response = await fetch(url)

    const data = await response.text()

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: data
    }

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Proxy error",
        details: error.message
      })
    }

  }

}