const apiKey = '9f176747b923620b00a8bc8aa89846d4'

const geocode = async city => {
  // Geocoding Endpoint
  let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)

  return await response.json()
}

(async () => {
  let city = await geocode('Nuremberg')
  city = city[0]
  // Current Weather Endpoint
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}`)
  const data = await response.json()
  console.log(data)
})()