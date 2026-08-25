import json
from urllib.parse import urlencode
from urllib.request import urlopen


WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Heavy rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail"
}


def get_current_weather(latitude, longitude):

    try:

        params = urlencode({
            "latitude": latitude,
            "longitude": longitude,
            "current": (
                "temperature_2m,"
                "relative_humidity_2m,"
                "apparent_temperature,"
                "precipitation,"
                "weather_code,"
                "wind_speed_10m"
            ),
            "timezone": "auto"
        })

        url = f"https://api.open-meteo.com/v1/forecast?{params}"

        with urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode("utf-8"))

        current = data.get("current", {})

        weather_code = current.get("weather_code")

        return {
            "temperature": current.get("temperature_2m"),
            "feels_like": current.get("apparent_temperature"),
            "humidity": current.get("relative_humidity_2m"),
            "precipitation": current.get("precipitation"),
            "wind_speed": current.get("wind_speed_10m"),
            "weather_code": weather_code,
            "condition": WEATHER_CODES.get(
                weather_code,
                "Unknown"
            ),
            "timezone": data.get("timezone")
        }

    except Exception as e:

        print("Weather API error:", e)

        return {
            "temperature": None,
            "feels_like": None,
            "humidity": None,
            "precipitation": None,
            "wind_speed": None,
            "weather_code": None,
            "condition": "Weather unavailable",
            "timezone": None
        }