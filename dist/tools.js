"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherTool = exports.DateTool = void 0;
// src/tools.ts
class DateTool {
    constructor() {
        // Assign Today's Date.
        this.today = new Date().toISOString().split("T")[0];
    }
    /**
     * DateTool.
     * Returns the current date.
     */
    getToday() {
        return this.today;
    }
    /**
     * DateTool.
     * Sets the current date.
     */
    setToday(input) {
        this.today = input.date;
    }
}
exports.DateTool = DateTool;
class WeatherTool {
    constructor() {
        this.weather = {
            "2028": "snowy",
            "2027": "rainy",
            "2026": "sunny",
            "2025": "cloudy",
            "2024": "rainy",
        };
    }
    /**
     * WeatherTool.
     * Returns the weather of the given year.
     */
    getTodayWeather(input) {
        const year = input.today.split("-")[0];
        return this.weather[year];
    }
}
exports.WeatherTool = WeatherTool;
