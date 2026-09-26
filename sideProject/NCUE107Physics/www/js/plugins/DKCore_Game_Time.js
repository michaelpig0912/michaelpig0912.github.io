/*
Title: Game Time
Author: DK (Denis Kuznetsov) (http://vk.com/dk_plugins)
Site: http://dk-plugins.ru
Group in VK: http://vk.com/dkplugins
Version: 1.61
Release: 03.12.2016
First release: 26.10.2015
Supported languages: Russian, English
*/

/*ru
Название: Время
Автор: DK (Денис Кузнецов) (http://vk.com/dk_plugins)
Сайт: http://dk-plugins.ru
Группа ВК: http://vk.com/dkplugins
Версия: 1.61
Релиз: 03.12.2016
Первый релиз: 26.10.2015
Поддерживаемые языки: Русский, Английский
*/

var DKLocalization = DKLocalization || {};

//===========================================================================
// Settings of the plugin
// Настройки плагина
//===========================================================================

/* Instruction

 Translation settings
 Plugin language: translation

 Settings of days week
 daysWeek - names of days week

 Settings of months
 months - names of months

 Settings of 12-hour time format
 am - name of "am"
 pm - name of "pm"

 Settings of date format in the time window
 %day_short - day without a leading 0
 %day - day
 %day_week - name of the day week
 %month_str - name of the month
 %month_num_short - month without a leading 0
 %month_num - month
 %year_short - the last 2 digits of the year
 %year - year

 Settings of time format in the time window
 %hour - hour
 %min - minutes
 %sec - seconds (will be updated if you activate the parameter of plugin "Show Seconds")
 %am - 12-hour format
 : - blink of colon

 mapWindowDate - date format for the time window on the map
 mapWindowTime - time format for the time window on the map
 menuWindowDate - date format for the time window in the menu
 menuWindowTime - time format for the time window in the menu
 battleWindowDate - date format for the time window in the battle
 battleWindowTime - time format for the time window in the battle

*/

/*ru Инструкция

 Настройки перевода
 Язык плагина: перевод

 Настройка дней недели
 daysWeek - Названия дней недели

 Настройка месяцев
 months - Названия месяцев

 Настройка 12-часового формата времени
 am - Обозначение "до полудня"
 pm - Обозначение "после полудня"

 Настройка формата даты в окне времени
 %day_short - день недели без ведущего 0
 %day - день недели
 %day_week - название дня недели
 %month_str - название месяца
 %month_num_short - месяц без ведущего 0
 %month_num - месяц
 %year_short - последние 2 цифры года
 %year - год

 Настройка формата времени в окне времени
 %hour - час
 %min - минуты
 %sec - секунды (будут обновляться, если включен параметр плагина "Show Seconds")
 %am - 12-часовой формат
 : - мерцание двоеточия

 mapWindowDate - Формат даты для окна времени на карте
 mapWindowTime - Формат времени для окна времени на карте
 menuWindowDate - Формат даты для окна времени в меню
 menuWindowTime - Формат времени для окна времени в меню
 battleWindowDate - Формат даты для окна времени в битве
 battleWindowTime - Формат времени для окна времени в битве

*/

DKLocalization.DKCore_Game_Time = {
	DKCoreImportedError: {
		ru: 'Отсутствует плагин "DKCore"! Плагин "DKCore_Game_Time" не будет работать!',
		en: 'No plugin "DKCore"! Plugin "DKCore_Game_Time" will not work!'
	},
    daysWeek: {
        ru: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
        en: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    },
	months: {
        ru: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
        en: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    },
    am: {
        ru: 'AM',
        en: '上午'
    },
    pm: {
        ru: 'PM',
        en: '下午'
    },
    mapWindowDate: {
        ru: '%day %month_str %year',
        en: '%year %month_str %day'
    },
    menuWindowDate: {
        ru: '%day %month_str %year',
        en: '%year 年 %month_str 月 %day 日'
    },
    battleWindowDate: {
        ru: '%day %month_str %year',
        en: '%year %month_str %day'
    },
    mapWindowTime: {
        ru: '%hour： %min',
        en: '%am %hour： %min'
    },
    menuWindowTime: {
        ru: '%hour： %min',
        en: '%am %hour： %min'
    },
    battleWindowTime: {
        ru: '%hour： %min',
        en: '%am %hour： %min'
    }
};

/* Instruction

 Settings of screen colors for Day/Night
 Warning! If you don't use the "Dynamic Day/Night" in the plugin parameters!
 Format: RED, GREEN, BLUE, OPACITY

*/

/*ru Инструкция

 Настройка оттенков экрана для смены дня и ночи
 Внимание! Если Вы не используете "Dynamic Day/Night" в параметрах плагина!
 Формат: RED, GREEN, BLUE, OPACITY

*/

var GAME_TIME_TINTS = [
    [30, 0, 40, 165], 	// => 0 hour
	[20, 0, 30, 165], 	// => 1 hour
	[20, 0, 30, 155], 	// => 2 hour
	[10, 0, 30, 145], 	// => 3 hour
	[10, 0, 20, 125], 	// => 4 hour
	[0, 0, 20, 125], 	// => 5 hour
	[75, 20, 20, 115], 	// => 6 hour
	[100, 30, 10,105],  // => 7 hour
	[75, 20, 10, 85], 	// => 8 hour
	[0, 0, 0, 55], 		// => 9 hour
	[0, 0, 0, 30], 		// => 10 hour
	[0, 0, 0, 10], 		// => 11 hour
	[0, 0, 0, 0], 		// => 12 hour
	[0, 0, 0, 0], 		// => 13 hour
	[0, 0, 0, 0], 		// => 14 hour
	[0, 0, 0, 5], 		// => 15 hour
	[0, 0, 0, 15], 		// => 16 hour
	[0, 0, 10, 45], 	// => 17 hour
	[75, 20, 20, 85], 	// => 18 hour
	[100, 40, 30, 105], // => 19 hour
	[75, 20, 40, 125], 	// => 20 hour
	[10, 0, 45, 140], 	// => 21 hour
	[20, 0, 45, 145], 	// => 22 hour
	[20, 0, 50, 160]	// => 23 hour
];

//===========================================================================
// End of the plugin settings
// Конец настройки плагина
//===========================================================================

/*:
 * @plugindesc v.1.61 System of time, Day/Night
 * @author DK (Denis Kuznetsov)
 * @help

 ### Info about plugin ###
 Title: DKCore_Game_Time
 Author: DK (Denis Kuznetsov) (http://vk.com/dk_plugins)
 Site: http://dk-plugins.ru
 Group in VK: http://vk.com/dkplugins
 Version: 1.61
 Release: 03.12.2016
 First release: 26.10.2015
 Supported languages: Russian, English

 ### Requirement for plugin ###
 Availability of working plugin DKCore version 1.81 or above

 ### Warning ###
 The plugin contains the settings in the file

 Be careful with downloading plugins to the project folder
 Some plugins have settings in his file
 At update this settings can be overwritten

 ### Instruction ###
 # Settings for static Day/Night #
 Warning! If you don't use the "Dynamic Day/Night" in the plugin parameters!
 Open the "DKCore_Game_Time.js" file and change parameters inside "Settings of the plugin" and "End of the plugin settings"

 # Change language in all supported plugins #
 In Event call the command of plugin: DKLocale [locale]
 [locale] - languages of the plugins (ru - russian, en - english)
 Example1: DKLocale ru
 Example2: DKLocale en

 # Get the time or date #
 $gameTime.sec - get the current seconds
 $gameTime.min - get the current minutes
 $gameTime.hour - get the current hour
 $gameTime.day - get the current day
 $gameTime.dayWeek - get the current day week
 $gameTime.month - get the current month
 $gameTime.year - get the current year

 ### Plugin commands ###
 1. Save time
 SaveGameTime

 2. Load time
 LoadGameTime

 3. Reset time
 ResetGameTime

 4. Set time speed
 SetGameTimeSpeed [speed]
 [speed] - speed of time (from 1 to 240)

 5. Set time
 5.1 Set one parameter
 SetGameTime [type] [value]
 [type] - Type of parameter (sec, min, hour, day, dayWeek, month, year)
 [value] - Value of parameter
 Example1: SetGameTime sec 10
 Example2: SetGameTime min 15

 5.2 Set all parameters
 SetGameTime [sec] [min] [hour] [day] [dayWeek] [month] [year]
 [sec] - seconds (starting at 0)
 [min] - minutes (starting at 0)
 [hour] - hour (starting at 0)
 [day] - day (starting at 1)
 [dayWeek] - day week (starting at 0... 0 - monday, 6 - sunday)
 [month] - month (starting at 0... 0 - january, 11 - december)
 [year] - year (starting at 0)
 Example: SetGameTime 0 0 10 1 0 0 2016

 6. Change time
 ChangeGameTime [type] [value]
 [type] - Type of parameter (sec, min, hour, day, dayWeek, month, year)
 [value] - Value of parameter
 Example1: ChangeGameTime sec 5
 Example2: ChangeGameTime min -10

 7. Pause update of time
 PauseGameTimeUpdate

 8. Resume update of time
 ResumeGameTimeUpdate

 9. Set update of time
 SetGameTimeUpdate [update]
 [update] - update of time (true or false)

 10. Set forward direction of time
 GameTimeForward

 11. Set backward direction of time
 GameTimeBackward

 12. Set direction of time
 SetGameTimeDirection [direction]
 [direction] - direction of time (backward or forward)

 13. Reverse the direction of time
 ReverseGameTime

 14. Show time window
 ShowGameTimeWindow

 15. Hide time window
 HideGameTimeWindow

 16. Set visibility of time window
 SetGameTimeWindowVisible [visible]
 [visible] - visibility of window (true or false)
 Example: SetGameTimeWindowVisible true

 17. Pause update of Day/Night
 PauseGameTintUpdate

 18. Resume update of Day/Night
 ResumeGameTintUpdate

 19. Show Day/Night
 ShowGameTint

 20. Hide Day/Night
 HideGameTint

 21. Set visibility of Day/Night
 SetGameTintVisible [visible]
 [visible] - visibility of Day/Night (true or false)
 Example: SetGameTintVisible false

 22. Set a static hour for Day/Night
 SetGameTintStaticHour [hour]
 [hour] - static hour for Day/Night (-1 to disable)
 Example1: SetGameTintStaticHour -1
 Example2: SetGameTintStaticHour 10

 ### Script commands ###
 1. Set time
 this.setGameTime(gameTime)
 gameTime - object of Game_Time

 ### Instruction for advanced users ###
 You can create Game_Time type objects for their own needs

 Constructor of Game_Time supports multiple parameter options:
 1. Without parameters (it will be created based on plugin parameters)
 Example: $gameTime = new Game_Time();

 2. With 1 parameter (object of Game_Time)
 Example: var gameTime = new Game_Time($gameTime);

 3. With parameters (7 parameters - sec, min, hour, day, dayWeek, month, year)
 Example: var gameTime = new Game_Time(0, 15, 10, 3, 2, 3, 479);

 For object of Game_Time are defined comparsion methods:

 more(gameTime, blockSeconds) - time > gameTime
 gameTime - object of Game_Time
 blockSeconds - block the seconds (true or false)
 Example: $gameTime.more(gameTime, false)

 less(gameTime, blockSeconds) - time < gameTime
 gameTime - object of Game_Time
 blockSeconds - block the seconds (true or false)
 Example: $gameTime.less(gameTime, true)

 moreEquals(gameTime, blockSeconds) - time >= gameTime
 gameTime - object of Game_Time
 blockSeconds - block the seconds (true or false)
 Example: $gameTime.moreEquals(gameTime, false)

 lessEquals(gameTime, blockSeconds) - time <= gameTime
 gameTime - object of Game_Time
 blockSeconds - block the seconds (true or false)
 Example: $gameTime.lessEquals(gameTime, true)

 equals(gameTime, blockSeconds) - time == gameTime
 gameTime - object of Game_Time
 blockSeconds - block the seconds (true or false)
 Example: $gameTime.equals(gameTime, false)

 Functions of time object

 clone() - clone a object of time
 window() - return window of time (if doesn't exist, return null)
 pause() - pause time update
 resume() - resume time update
 save() - save time
 load() - load time
 backward() - backward direction of time
 forward() - forward direction of time
 reverse() - reverse direction of time
 toString() - return string of time
 print() - output a string of time at console
 setTime(object, min, hour) - set time
 setDate(object, dayWeek, month, year) - set date
 setAll(object, min, hour, day, dayWeek, month, year) - set time and date
 setTimeSpeed(speed) - set time speed
 setTimeUpdate(update) - set time update
 setTimeDirection(direction) - set direction of time
 isUpdated() - return true if time is updated
 isReversed() - return true if time is reversed
 add(object, min, hour, day, dayWeek, month, year) - adds the time and date
 rem(object, min, hour, day, dayWeek, month, year) - removes the time and date
 secondsInMinute() - returns the number of seconds in a minute
 minutesInHour() - returns the number of minutes in a hour
 hoursInDay() - returns the number of hours in a day
 daysInWeek() - returns the number of days in a week
 daysInMonth() - returns the number of days in the current month
 monthsInYear() - returns the number of months in a year
 addSec(sec) - adds the seconds
 addMin(min) - adds the minutes
 addHour(hour) - adds the hours
 addDayWeek(dayWeek) - adds the days week
 addDay(day, block) - adds the days
 addMonth(month) - adds the months
 addYear(year) - adds the years
 remSec(sec) - removes the seconds
 remMin(min) - removes the minutes
 remHour(hour) - removes the hours
 remDayWeek(dayWeek) - removes the days week
 remDay(day, block) - removes the days
 remMonth(month) - removes the months
 remYear(year) - removes the years
 setSec(sec) - sets the seconds
 setMin(min) - sets the minutes
 setHour(hour) - sets the hours
 setDayWeek(dayWeek) - sets the days week
 setDay(day) - sets the days
 setMonth(month) - sets the months
 setYear(year) - sets the years

 ### For developers ###
 Change language in all supported plugins
 DKLocalizationManager.setLocale(locale);
 locale - plugin language (ru - russian, en - english)
 Example: DKLocalizationManager.setLocale('ru');
 Example: DKLocalizationManager.setLocale('en');

 ### License and terms of use for plugin ###
 You can:
 -Free use the plugin for your commercial and non commercial projects.
 -Translate the plugin to other languages (please, inform, if you do this)

 You can't:
 -Delete or change any information about plugin (Title, authorship, contact information, version and release)
 -Change code of plugin out of border "Plugin settings" and "End of plugin settings" (if you found a bug contact me)

 * @param Settings of Time
 * @default ---------------------------------

 * @param Use Real Time
 * @desc Use time from your computer ? (true or false)
 * @default false

 * @param Starting Seconds
 * @desc Amount of seconds on game start (starting at 0)
 * @default 0

 * @param Starting Minutes
 * @desc Amount of minutes on game start (starting at 0)
 * @default 0

 * @param Starting Hour
 * @desc Amount of hours on game start (starting at 0)
 * @default 0

 * @param Starting Day
 * @desc Amount of days on game start (starting at 1)
 * @default 1

 * @param Starting Day Week
 * @desc Amount of days week on game start (0 - monday, 6 - sunday)
 * @default 0

 * @param Starting Month
 * @desc Amount of months on game start (starting at 0)
 * @default 0

 * @param Starting Year
 * @desc Amount of years on game start (starting at 0)
 * @default 2016

 * @param Seconds In Minute
 * @desc Amount of seconds in minute (minimum 1)
 * @default 60

 * @param Minutes In Hour
 * @desc Amount of minutes in hour (minimum 1)
 * @default 60

 * @param Hours In Day
 * @desc Amount of hours in day (minimum 1)
 * @default 24

 * @param Days In Month
 * @desc Amount of days in each month separated by commas
Default: 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
 * @default 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31

 * @param Updating Time In Menu
 * @desc Update time in menu ? (true or false)
 * @default false

 * @param Updating Time In Battle
 * @desc Update time in battle ? (true or false)
 * @default false

 * @param Pause When Message
 * @desc Stop time when the message on the screen? (true or false)
 * @default true

 * @param Time Speed
 * @desc Speed of time (from 1 to 240)
 * @default 1

 * @param Settings of disabled maps
 * @default ---------------------------------

 * @param Disabled Maps For Updating Time
 * @desc Numbers of maps, separated by commas, in which time is not updated
 * @default

 * @param Disabled Maps For Window
 * @desc Numbers of maps, separated by commas, in which window is not show
 * @default

 * @param Disabled Maps For Switching Day/Night
 * @desc Numbers of maps, separated by commas, in which Day/Night is not show
 * @default

 * @param Common Settings of Windows
 * @default ---------------------------------

 * @param Show Seconds
 * @desc Show seconds in window ? (true or false)
 * @default false

 * @param Time Blink
 * @desc speed of time blink (minimum 1) (-1 to disable)
 * @default 30

 * @param Settings of Window in Game
 * @default ---------------------------------

 * @param Show Window In Game
 * @desc Show window of time in game ? (true or false)
 * @default true

 * @param Window Switch In Game
 * @desc Switch ID, which controls the displaying a window (-1 to disable)
 * @default -1

 * @param Window Position In Game
 * @desc Coordinate X, Y, width and height of window in game
 * @default 0, 0, 264, 108

 * @param Window Skin In Game
 * @desc Window skin of window in game (-1 to disable)
Default: -1
 * @default -1

 * @param Window Opacity In Game
 * @desc Window opacity, text opacity, background opacity
Default: -1, -1, -1
 * @default -1, -1, -1

 * @param Window Tone In Game
 * @desc Values from -255 to 255
Default: 0, 0, 0
 * @default 0, 0, 0

 * @param Date Font In Game
 * @desc Font name, italic, text size
Default -1, false, -1
 * @default -1, false, -1

 * @param Time Font In Game
 * @desc Font name, italic, text size
Default -1, false, -1
 * @default -1, false, -1

 * @param Date Color In Game
 * @desc The color in hex format
Default: #ffffff
 * @default #ffffff

 * @param Time Color In Game
 * @desc The color in hex format
Default: #ffffff
 * @default #ffffff

 * @param Show Window On Game Start
 * @desc Show window of time on game start ? (true or false)
 * @default true

 * @param Window Control Button
 * @desc Key name (-1 to disable)
 * @default -1

 * @param Frameless Window In Game
 * @desc Show window without frame? (true or false)
Default: false
 * @default false

 * @param Settings of Window in Menu
 * @default ---------------------------------

 * @param Show Window In Menu
 * @desc Show window of time in menu ? (true or false)
 * @default true

 * @param Window Switch In Menu
 * @desc Switch ID, which controls the displaying a window (-1 to disable)
 * @default -1

 * @param Window Position In Menu
 * @desc Coordinate X, Y, width and height of window in menu
 * @default 0, 324, 240, 108

 * @param Window Skin In Menu
 * @desc Window skin of window in menu (-1 to disable)
Default: -1
 * @default -1

 * @param Window Opacity In Menu
 * @desc Window opacity, text opacity, background opacity
Default: -1, -1, -1
 * @default -1, -1, -1

 * @param Window Tone In Menu
 * @desc Values from -255 to 255
Default: 0, 0, 0
 * @default 0, 0, 0

 * @param Date Font In Menu
 * @desc Font name, italic, text size
Default -1, false, -1
 * @default -1, false, -1

 * @param Time Font In Menu
 * @desc Font name, italic, text size
Default -1, false, -1
 * @default -1, false, -1

 * @param Date Color In Menu
 * @desc The color in hex format
Default: #ffffff
 * @default #ffffff

 * @param Time Color In Menu
 * @desc The color in hex format
Default: #ffffff
 * @default #ffffff

 * @param Frameless Window In Menu
 * @desc Show window without frame? (true or false)
Default: false
 * @default false

 * @param Settings of Window in Battle
 * @default ---------------------------------

 * @param Show Window In Battle
 * @desc Show window of time in battle ? (true or false)
 * @default false

 * @param Window Switch In Battle
 * @desc Switch ID, which controls the displaying a window (-1 to disable)
 * @default -1

 * @param Window Position In Battle
 * @desc Coordinate X, Y, width and height of window in battle
 * @default 0, 0, 264, 108

 * @param Window Skin In Battle
 * @desc Window skin of window in battle (-1 to disable)
Default: -1
 * @default -1

 * @param Window Opacity In Battle
 * @desc Window opacity, text opacity, background opacity
Default: -1, -1, -1
 * @default -1, -1, -1

 * @param Window Tone In Battle
 * @desc Values from -255 to 255
Default: 0, 0, 0
 * @default 0, 0, 0

 * @param Date Font In Battle
 * @desc Font name, italic, text size
Default -1, false, -1
 * @default -1, false, -1

 * @param Time Font In Battle
 * @desc Font name, italic, text size
Default -1, false, -1
 * @default -1, false, -1

 * @param Date Color In Battle
 * @desc The color in hex format
Default: #ffffff
 * @default #ffffff

 * @param Time Color In Battle
 * @desc The color in hex format
Default: #ffffff
 * @default #ffffff

 * @param Frameless Window In Battle
 * @desc Show window without frame? (true or false)
Default: false
 * @default false

 * @param Settings of Day/Night
 * @default ---------------------------------

 * @param Use Day/Night
 * @desc Use change of day/night ? (true or false). Change in the file of plugin
 * @default false

 * @param Show Day/Night On Game Start
 * @desc Show Day/Night on game start ? (true or false)
 * @default true

 * @param Dynamic Day/Night
 * @desc Use dynamic Day/Night ? (true or false)
 * @default true

 * @param Use Day/Night In Battle
 * @desc Use Day/Night in battle ? (true or false)
 * @default false

 * @param Show Day/Night In Map Background
 * @desc Show Day/Night in map background ? (true or false)
 * @default true

 * @param Switch Day/Night
 * @desc Switch ID, which controls the displaying of Day/Night (-1 to disable)
 * @default -1

 * @param Settings of Variables
 * @default ---------------------------------

 * @param Variable For Seconds
 * @desc Variable ID, which will be written the seconds of time (-1 to disable)
 * @default -1

 * @param Variable For Minutes
 * @desc Variable ID, which will be written the minutes of time (-1 to disable)
 * @default -1

 * @param Variable For Hours
 * @desc Variable ID, which will be written the hour of time (-1 to disable)
 * @default -1

 * @param Variable For Days
 * @desc Variable ID, which will be written the day of time (-1 to disable)
 * @default -1

 * @param Variable For Days Week
 * @desc Variable ID, which will be written the day week of time (-1 to disable)
 * @default -1

 * @param Variable For Months
 * @desc Variable ID, which will be written the month of time (-1 to disable)
 * @default -1

 * @param Variable For Years
 * @desc Variable ID, which will be written the year of time (-1 to disable)
 * @default -1

*/

/*:ru
 * @plugindesc v.1.61 Система времени, смены дня и ночи
 * @author DK (Денис Кузнецов)
 * @help

 ### Информация о плагине ###
 Название: DKCore_Game_Time
 Автор: DK Денис Кузнецов) (https://vk.com/dk_plugins)
 Сайт: http://dk-plugins.ru
 Группа ВК: http://vk.com/dkplugins
 Версия: 1.61
 Релиз: 03.12.2016
 Первый релиз: 26.10.2015
 Поддерживаемые языки: Русский, Английский

 ### Требования к плагину ###
 Наличие включенного плагина DKCore версии 1.81 или выше

 ### Внимание ###
 Плагин содержит настройки внутри файла

 Будьте внимательны при скачивании плагинов в папку проекта
 Некоторые плагины имеют настройки в самом файле
 При обновлении эти настройки могут быть перезаписаны

 ### Инструкция ###
 # Настройка статической смены дня и ночи #
 Внимание! Если Вы не используете "Dynamic Day/Night" в параметрах плагина!
 Откройте "DKCore_Game_Time.js" файл и измените настройки внутри "Настройки плагина" и "Конец настройки плагина"

 # Изменение языка #
 В событии вызвать команду плагина: DKLocale [locale]
 [locale] - Язык плагинов (ru - русский, en - английский)
 Пример1: DKLocale ru
 Пример2: DKLocale en

 # Получить время или дату #
 $gameTime.sec - получить текущие секунды
 $gameTime.min - получить текущие минуты
 $gameTime.hour - получить текущий час
 $gameTime.day - получить текущий день
 $gameTime.dayWeek - получить текущий день недели
 $gameTime.month - получить текущий месяц
 $gameTime.year - получить текущий год

 ### Команды плагина ###
 1. Сохранить время
 SaveGameTime

 2. Загрузить время
 LoadGameTime

 3. Сбросить время
 ResetGameTime

 4. Установить скорость времени
 SetGameTimeSpeed [speed]
 [speed] - Скорость времени (от 1 до 240)

 5. Установить время
 5.1 Установить один параметр
 SetGameTime [type] [value]
 [type] - Тип параметра (sec, min, hour, day, dayWeek, month, year)
 [value] - Значение параметра
 Пример1: SetGameTime sec 10
 Пример2: SetGameTime min 15

 5.2 Установить все параметры
 SetGameTime [sec] [min] [hour] [day] [dayWeek] [month] [year]
 [sec] - секунды (начиная с 0)
 [min] - минуты (начиная с 0)
 [hour] - час (начиная с 0)
 [day] - день (начиная с 1)
 [dayWeek] - день недели (начиная с 0... 0 - понедельник, 6 - воскресенье)
 [month] - месяц (начиная с 0... 0 - январь, 11 - декабрь)
 [year] - год (начиная с 0)
 Пример: SetGameTime 0 0 10 1 0 0 2016

 6. Изменить время
 ChangeGameTime [type] [value]
 [type] - Тип параметра (sec, min, hour, day, dayWeek, month, year)
 [value] - Значение параметра
 Пример1: ChangeGameTime sec 5
 Пример2: ChangeGameTime min -10

 7. Остановить обновление времени
 PauseGameTimeUpdate

 8. Продолжить обновление времени
 ResumeGameTimeUpdate

 9. Установить обновление времени
 SetGameTimeUpdate [update]
 [update] - Обновление времени (true - да, false - нет)

 10. Установить направление времени вперед
 GameTimeForward

 11. Установить направление времени назад
 GameTimeBackward

 12. Установить направление времени
 SetGameTimeDirection [direction]
 [direction] - Направление времени (backward - назад, forward - вперед)

 13. Изменить направление времени на обратное
 ReverseGameTime

 14. Показать окно времени
 ShowGameTimeWindow

 15. Скрыть окно времени
 HideGameTimeWindow

 16. Установить видимость окна времени
 SetGameTimeWindowVisible [visible]
 [visible] - Видимость окна (true - да, false - нет)
 Пример: SetGameTimeWindowVisible true

 17. Остановить обновление смены дня и ночи
 PauseGameTintUpdate

 18. Продолжить обновление смены дня и ночи
 ResumeGameTintUpdate

 19. Показать смену дня и ночи
 ShowGameTint

 20. Скрыть смену дня и ночи
 HideGameTint

 21. Установить видимость смены дня и ночи
 SetGameTintVisible [visible]
 [visible] - Видимость смены дня и ночи (true - да, false - нет)
 Пример: SetGameTintVisible false

 22. Установить статический час для смены дня и ночи
 SetGameTintStaticHour [hour]
 [hour] - Час статического освещения для смены дня и ночи (-1 чтобы отключить)
 Пример1: SetGameTintStaticHour -1
 Пример2: SetGameTintStaticHour 10

 ### Скрипты плагина ###
 1. Установить время
 this.setGameTime(gameTime)
 gameTime - объект Game_Time

 ### Инструкция для опытных пользователей ###
 Вы можете создавать объекты типа Game_Time для своих нужд

 Конструктор Game_Time поддерживает несколько вариантов параметров:
 1. Без параметров (будет создано время на основе настроек плагина)
 Пример: $gameTime = new Game_Time();

 2. С 1 параметром (объект Game_Time)
 Пример: var gameTime = new Game_Time($gameTime);

 3. С параметрами (7 параметров - sec, min, hour, day, dayWeek, month, year)
 Пример: var gameTime = new Game_Time(0, 15, 10, 3, 2, 3, 479);

 Для объекта Game_Time определены следующие методы сравнения:

 more(gameTime, blockSeconds) - время слева больше времени справа
 gameTime - объект Game_Time
 blockSeconds - блокировка сравнения секунд (true - да, false - нет)
 Пример: $gameTime.more(gameTime, false)

 less(gameTime, blockSeconds) - время слева меньше времени справа
 gameTime - объект Game_Time
 blockSeconds - блокировка сравнения секунд (true - да, false - нет)
 Пример: $gameTime.less(gameTime, true)

 moreEquals(gameTime, blockSeconds) - время слева больше времени справа
 gameTime - объект Game_Time
 blockSeconds - блокировка сравнения секунд (true - да, false - нет)
 Пример: $gameTime.moreEquals(gameTime, false)

 lessEquals(gameTime, blockSeconds) - время слева меньше времени справа
 gameTime - объект Game_Time
 blockSeconds - блокировка сравнения секунд (true - да, false - нет)
 Пример: $gameTime.lessEquals(gameTime, true)

 equals(gameTime, blockSeconds) - время слева равно времени справа
 gameTime - объект Game_Time
 blockSeconds - блокировка сравнения секунд (true - да, false - нет)
 Пример: $gameTime.equals(gameTime, false)

 Функции объекта времени

 clone() - клонирует объект времени
 window() - возвращает окно времени (если его нет, возвращает null)
 pause() - останавливает обновление времени
 resume() - продолжает обновлять время
 save() - сохраняет время
 load() - загружает время
 backward() - меняет направление времени назад
 forward() - меняет направление времени вперед
 reverse() - переворачивает направление времени
 toString() - возвращает строку времени
 print() - выводит строку времени в консоль
 setTime(object, min, hour) - устанавливает время
 setDate(object, dayWeek, month, year) - устанавливает дату
 setAll(object, min, hour, day, dayWeek, month, year) - устанавливает время и дату
 setTimeSpeed(speed) - устанавливает скорость обновления времени
 setTimeUpdate(update) - устанавливает обновление времени
 setTimeDirection(direction) - устанавливает направление времени
 isUpdated() - возвращает true, если время обновляется
 isReversed() - возвращает true, если время идет назад
 add(object, min, hour, day, dayWeek, month, year) - добавляет время и дату
 rem(object, min, hour, day, dayWeek, month, year) - удаляет время и дату
 secondsInMinute() - возвращает количество секунд в минуте
 minutesInHour() - возвращает количество минут в часе
 hoursInDay() - возвращает количество часов в дне
 daysInWeek() - возвращает количество дней в неделе
 daysInMonth() - возвращает количество дней в текущем месяце
 monthsInYear() - возвращает количество месяцев в году
 addSec(sec) - добавляет секунды
 addMin(min) - добавляет минуты
 addHour(hour) - добавляет часы
 addDayWeek(dayWeek) - добавляет дни недели
 addDay(day, block) - добавляет дни
 addMonth(month) - добавляет месяцы
 addYear(year) - добавляет года
 remSec(sec) - удаляет секунды
 remMin(min) - удаляет минуты
 remHour(hour) - удаляет часы
 remDayWeek(dayWeek) - удаляет дни недели
 remDay(day, block) - удаляет дни
 remMonth(month) - удаляет месяцы
 remYear(year) - удаляет года
 setSec(sec) - устанавливает секунды
 setMin(min) - устанавливает минуты
 setHour(hour) - устанавливает часы
 setDay(day) - устанавливает день
 setDayWeek(dayWeek) - устанавливает день недели
 setMonth(month) - устанавливает месяц
 setYear(year) - устанавливает год

 ### Для разработчиков ###
 Смена языка у всех поддерживаемых плагинов
 DKLocalizationManager.setLocale(locale);
 locale - Язык плагинов (ru - русский, en - английский)
 Пример1: DKLocalizationManager.setLocale('ru');
 Пример2: DKLocalizationManager.setLocale('en');

 ### Лицензия и правила использования плагина ###
 Вы можете:
 -Бесплатно использовать данный плагин в некоммерческих и коммерческих проектах
 -Переводить плагин на другие языки (пожалуйста, сообщите, если Вы перевели плагин на другой язык)

 Вы не можете:
 -Убирать или изменять любую информацию о плагине (Название, авторство, контактная информация, версия и дата релиза)
 -Изменять код плагина вне поля "Настройки плагина" и "Конец настройки плагина" (если нашли ошибку, напишите мне о ней)

 * @param Настройка времени
 * @default ---------------------------------

 * @param Use Real Time
 * @desc Использовать время с компьютера ? true - да, false - нет
 * @default false

 * @param Starting Seconds
 * @desc Количество секунд в начале игры (начиная с 0)
 * @default 0

 * @param Starting Minutes
 * @desc Количество минут в начале игры (начиная с 0)
 * @default 0

 * @param Starting Hour
 * @desc Количество часов в начале игры (начиная с 0)
 * @default 0

 * @param Starting Day
 * @desc Какой день в начале игры (начиная с 1)
 * @default 1

 * @param Starting Day Week
 * @desc День недели в начале игры (0 - понедельник, 6 - воскресенье)
 * @default 0

 * @param Starting Month
 * @desc Какой месяц в начале игры (начиная с 0)
 * @default 0

 * @param Starting Year
 * @desc Какой год в начале игры (начиная с 0)
 * @default 2016

 * @param Seconds In Minute
 * @desc Количество секунд в одной минуте (минимум 1)
 * @default 60

 * @param Minutes In Hour
 * @desc Количество минут в одном часе (минимум 1)
 * @default 60

 * @param Hours In Day
 * @desc Количество часов в одном дне (минимум 1)
 * @default 24

 * @param Days In Month
 * @desc Количество дней в каждом месяце через запятую
Стандартно: 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
 * @default 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31

 * @param Updating Time In Menu
 * @desc Обновлять время в меню ? true - да, false - нет
 * @default false

 * @param Updating Time In Battle
 * @desc Обновлять время в битве ? true - да, false - нет
 * @default false

 * @param Pause When Message
 * @desc Останавливать время при сообщении на экране ? true - да, false - нет
 * @default true

 * @param Time Speed
 * @desc Скорость течения времени (от 1 до 240)
 * @default 1

 * @param Настройки отключенных карт
 * @default ---------------------------------

 * @param Disabled Maps For Updating Time
 * @desc Номера карт через запятую, на которых время не обновляется
 * @default

 * @param Disabled Maps For Window
 * @desc Номера карт через запятую, на которых окно времени не отображается
 * @default

 * @param Disabled Maps For Switching Day/Night
 * @desc Номера карт через запятую, на которых смена дня и ночи не происходит
 * @default

 * @param Общие настройки окон
 * @default ---------------------------------

 * @param Show Seconds
 * @desc Отображать и обновлять секунды в окне ? true - да, false - нет
 * @default false

 * @param Time Blink
 * @desc Скорость мерцания двоеточия (минимум 1) (-1 чтобы отключить)
 * @default 30

 * @param Настройки окна в игре
 * @default ---------------------------------

 * @param Show Window In Game
 * @desc Отображать окно времени на карте игры ? true - да, false - нет
 * @default true

 * @param Window Switch In Game
 * @desc Номер переключателя, который управляет отображением окна
 (-1 чтобы отключить)
 * @default -1

 * @param Window Position In Game
 * @desc Координата X, Y, ширина и высота окна времени на карте игры
 * @default 0, 0, 264, 108

 * @param Window Skin In Game
 * @desc Window Skin времени на карте игры (-1 чтобы отключить)
Стандартно: -1
 * @default -1

 * @param Window Opacity In Game
 * @desc Window Opacity, прозрачность текста, прозрачность фона
Стандартно: -1, -1, -1
 * @default -1, -1, -1

 * @param Window Tone In Game
 * @desc Значения от -255 до 255
Стандартно: 0, 0, 0
 * @default 0, 0, 0

 * @param Date Font In Game
 * @desc Название шрифта, курсив, размер текста
Стандартно -1, false, -1
 * @default -1, false, -1

 * @param Time Font In Game
 * @desc Название шрифта, курсив, размер текста
Стандартно -1, false, -1
 * @default -1, false, -1

 * @param Date Color In Game
 * @desc Цвет в hex формате
Стандартно: #ffffff
 * @default #ffffff

 * @param Time Color In Game
 * @desc Цвет в hex формате
Стандартно: #ffffff
 * @default #ffffff

 * @param Show Window On Game Start
 * @desc Отображать окно времени в начале игры ? true - да, false - нет
 * @default true

 * @param Window Control Button
 * @desc Укажите название клавиши. -1 чтобы не использовать
 * @default -1

 * @param Frameless Window In Game
 * @desc Отображать окно без рамки ? true - да, false - нет
Стандартно: false
 * @default false

 * @param Настройки окна в меню
 * @default ---------------------------------

 * @param Show Window In Menu
 * @desc Отображать окно времени в меню ? true - да, false - нет
 * @default true

 * @param Window Switch In Menu
 * @desc Номер переключателя, который управляет отображением окна
 (-1 чтобы отключить)
 * @default -1

 * @param Window Position In Menu
 * @desc Координата X, Y, ширина и высота окна времени на карте игры
 * @default 0, 324, 240, 108

 * @param Window Skin In Menu
 * @desc Window Skin времени в меню (-1 чтобы отключить)
Стандартно: -1
 * @default -1

 * @param Window Opacity In Menu
 * @desc Window Opacity, прозрачность текста, прозрачность фона
Стандартно: -1, -1, -1
 * @default -1, -1, -1

 * @param Window Tone In Menu
 * @desc Значения от -255 до 255
Стандартно: 0, 0, 0
 * @default 0, 0, 0

 * @param Date Font In Menu
 * @desc Название шрифта, курсив, размер текста
Стандартно -1, false, -1
 * @default -1, false, -1

 * @param Time Font In Menu
 * @desc Название шрифта, курсив, размер текста
Стандартно -1, false, -1
 * @default -1, false, -1

 * @param Date Color In Menu
 * @desc Цвет в hex формате
Стандартно: #ffffff
 * @default #ffffff

 * @param Time Color In Menu
 * @desc Цвет в hex формате
Стандартно: #ffffff
 * @default #ffffff

 * @param Frameless Window In Menu
 * @desc Отображать окно без рамки ? true - да, false - нет
Стандартно: false
 * @default false

 * @param Настройки окна в битве
 * @default ---------------------------------

 * @param Show Window In Battle
 * @desc Отображать окно времени в битве ? true - да, false - нет
 * @default false

 * @param Window Switch In Battle
 * @desc Номер переключателя, который управляет отображением окна
 (-1 чтобы отключить)
 * @default -1

 * @param Window Position In Battle
 * @desc Координата X, Y, ширина и высота окна времени на карте игры
 * @default 0, 0, 264, 108

 * @param Window Skin In Battle
 * @desc Window Skin времени в битве (-1 чтобы отключить)
Стандартно: -1
 * @default -1

 * @param Window Opacity In Battle
 * @desc Window Opacity, прозрачность текста, прозрачность фона
Стандартно: -1, -1, -1
 * @default -1, -1, -1

 * @param Window Tone In Battle
 * @desc Значения от -255 до 255
Стандартно: 0, 0, 0
 * @default 0, 0, 0

 * @param Date Font In Battle
 * @desc Название шрифта, курсив, размер текста
Стандартно -1, false, -1
 * @default -1, false, -1

 * @param Time Font In Battle
 * @desc Название шрифта, курсив, размер текста
Стандартно -1, false, -1
 * @default -1, false, -1

 * @param Date Color In Battle
 * @desc Цвет в hex формате
Стандартно: #ffffff
 * @default #ffffff

 * @param Time Color In Battle
 * @desc Цвет в hex формате
Стандартно: #ffffff
 * @default #ffffff

 * @param Frameless Window In Battle
 * @desc Отображать окно без рамки ? true - да, false - нет
Стандартно: false
 * @default false

 * @param Настройка смены дня и ночи
 * @default ---------------------------------

 * @param Use Day/Night
 * @desc Использовать смену дня и ночи ? true - да, false - нет. Настраивается в js файле плагина
 * @default false

 * @param Show Day/Night On Game Start
 * @desc Отображать оттенки экрана смены дня и ночи в начале игры ? true - да, false - нет
 * @default true

 * @param Dynamic Day/Night
 * @desc Использовать динамические оттенки для экрана ? true - да, false - нет. Будут использоваться значения из самого плагина
 * @default true

 * @param Use Day/Night In Battle
 * @desc Использовать смену дня и ночи в битве ? true - да, false - нет
 * @default false

 * @param Show Day/Night In Map Background
 * @desc Отображать смену дня и ночи в фоне карты ? true - да, false - нет
 * @default true

 * @param Switch Day/Night
 * @desc Номер переключателя, который управляет отображением смены дня и ночи (-1 чтобы отключить)
 * @default -1

 * @param Настройка переменных
 * @default ---------------------------------

 * @param Variable For Seconds
 * @desc Номер переменной, в которую будут записываться текущие секунды (-1 чтобы отключить)
 * @default -1

 * @param Variable For Minutes
 * @desc Номер переменной, в которую будут записываться текущие минуты (-1 чтобы отключить)
 * @default -1

 * @param Variable For Hours
 * @desc Номер переменной, в которую будет записываться текущий час (-1 чтобы отключить)
 * @default -1

 * @param Variable For Days
 * @desc Номер переменной, в которую будет записываться текущий день (-1 чтобы отключить)
 * @default -1

 * @param Variable For Days Week
 * @desc Номер переменной, в которую будет записываться текущий день недели (-1 чтобы отключить)
 * @default -1

 * @param Variable For Months
 * @desc Номер переменной, в которую будет записываться текущий месяц (-1 чтобы отключить)
 * @default -1

 * @param Variable For Years
 * @desc Номер переменной, в которую будет записываться текущий год (-1 чтобы отключить)
 * @default -1

*/

var Imported = Imported || {};
Imported.DKCore_Game_Time = true;

var DKVersion = DKVersion || {};
DKVersion.DKCore_Game_Time = 1.61;

var DKCoreVersion = DKCoreVersion || {};
DKCoreVersion.DKCore_Game_Time = 1.81;

if (!Imported.DKCore) {
    var locale = (window.navigator.language === 'ru' ? 'ru' : 'en');
    throw new Error(DKLocalization['DKCore_Game_Time']['DKCoreImportedError'][locale]);
}

var $gameTime = null;
var $gameTint = null;

var GameTimeParam = {};
GameTimeParam.param = PluginManager.parameters('DKCore_Game_Time');

// Initialize time settings
GameTimeParam.realTime 					    = 	DKCore.toBool(GameTimeParam.param['Use Real Time']);
GameTimeParam.startSec 					    = 	Number(GameTimeParam.param['Starting Seconds']);
GameTimeParam.startMin 					    = 	Number(GameTimeParam.param['Starting Minutes']);
GameTimeParam.startHour 				    = 	Number(GameTimeParam.param['Starting Hour']);
GameTimeParam.startDay 					    = 	Number(GameTimeParam.param['Starting Day']);
GameTimeParam.startDayWeek 				    = 	Number(GameTimeParam.param['Starting Day Week']);
GameTimeParam.startMonth 				    = 	Number(GameTimeParam.param['Starting Month']);
GameTimeParam.startYear 				    = 	Number(GameTimeParam.param['Starting Year']);
GameTimeParam.secondsInMinute 			    = 	Number(GameTimeParam.param['Seconds In Minute']);
GameTimeParam.minutesInHour 			    = 	Number(GameTimeParam.param['Minutes In Hour']);
GameTimeParam.hoursInDay 				    = 	Number(GameTimeParam.param['Hours In Day']);
GameTimeParam.daysInMonth 				    = 	DKCore.StringToNumberArray(GameTimeParam.param['Days In Month']);
GameTimeParam.updateTimeInMenu 			    = 	DKCore.toBool(GameTimeParam.param['Updating Time In Menu']);
GameTimeParam.updateTimeInBattle 		    = 	DKCore.toBool(GameTimeParam.param['Updating Time In Battle']);
GameTimeParam.pauseTimeInMessage 		    = 	DKCore.toBool(GameTimeParam.param['Pause When Message']);
GameTimeParam.timeSpeed 				    = 	Number(GameTimeParam.param['Time Speed']);
GameTimeParam.showSeconds 				    = 	DKCore.toBool(GameTimeParam.param['Show Seconds']);
GameTimeParam.blinkSpeed 				    = 	Number(GameTimeParam.param['Time Blink']);

// Initialize disabled maps
GameTimeParam.disabledMaps                  =   {};
GameTimeParam.disabledMaps['update']        =   DKCore.StringToNumberArray(GameTimeParam.param['Disabled Maps For Updating Time']);
GameTimeParam.disabledMaps['window']        =   DKCore.StringToNumberArray(GameTimeParam.param['Disabled Maps For Window']);
GameTimeParam.disabledMaps['tint']          =   DKCore.StringToNumberArray(GameTimeParam.param['Disabled Maps For Switching Day/Night']);

// Initialize map window
GameTimeParam.mapWindow 				    = 	{};
GameTimeParam.mapWindow.mode 			    = 	'map';
GameTimeParam.mapWindow.show			    =	DKCore.toBool(GameTimeParam.param['Show Window In Game']);
GameTimeParam.mapWindow.switch			    =	Number(GameTimeParam.param['Window Switch In Game']);
GameTimeParam.mapWindow.parameters		    = 	DKCore.StringToNumberArray(GameTimeParam.param['Window Position In Game']);
GameTimeParam.mapWindow.windowskin		    = 	GameTimeParam.param['Window Skin In Game'];
GameTimeParam.mapWindow.opacity 		    = 	DKCore.StringToNumberArray(GameTimeParam.param['Window Opacity In Game']);
GameTimeParam.mapWindow.tone			    =	DKCore.StringToNumberArray(GameTimeParam.param['Window Tone In Game']);
GameTimeParam.mapWindow.font 			    = 	{};
GameTimeParam.mapWindow.font['date']	    =	DKCore.StringToFontArray(GameTimeParam.param['Date Font In Game']);
GameTimeParam.mapWindow.font['time']	    =	DKCore.StringToFontArray(GameTimeParam.param['Time Font In Game']);
GameTimeParam.mapWindow.color			    =	{};
GameTimeParam.mapWindow.color['date']	    =	GameTimeParam.param['Date Color In Game'];
GameTimeParam.mapWindow.color['time']	    =	GameTimeParam.param['Time Color In Game'];
GameTimeParam.mapWindow.showOnStart 	    = 	DKCore.toBool(GameTimeParam.param['Show Window On Game Start']);
GameTimeParam.mapWindow.button			    =	GameTimeParam.param['Window Control Button'].toLowerCase();
GameTimeParam.mapWindow.frameless 		    = 	DKCore.toBool(GameTimeParam.param['Frameless Window In Game']);
GameTimeParam.mapWindow.dateFormat          =   '#mapWindowDate#';
GameTimeParam.mapWindow.timeFormat          =   '#mapWindowTime#';

// Initialize menu window
GameTimeParam.menuWindow 				    = 	{};
GameTimeParam.menuWindow.mode 			    = 	'menu';
GameTimeParam.menuWindow.show			    =	DKCore.toBool(GameTimeParam.param['Show Window In Menu']);
GameTimeParam.menuWindow.switch			    =	Number(GameTimeParam.param['Window Switch In Menu']);
GameTimeParam.menuWindow.parameters		    = 	DKCore.StringToNumberArray(GameTimeParam.param['Window Position In Menu']);
GameTimeParam.menuWindow.windowskin		    = 	GameTimeParam.param['Window Skin In Menu'];
GameTimeParam.menuWindow.opacity 		    = 	DKCore.StringToNumberArray(GameTimeParam.param['Window Opacity In Menu']);
GameTimeParam.menuWindow.tone			    =	DKCore.StringToNumberArray(GameTimeParam.param['Window Tone In Menu']);
GameTimeParam.menuWindow.font 			    = 	{};
GameTimeParam.menuWindow.font['date']	    =	DKCore.StringToFontArray(GameTimeParam.param['Date Font In Menu']);
GameTimeParam.menuWindow.font['time']	    =	DKCore.StringToFontArray(GameTimeParam.param['Time Font In Menu']);
GameTimeParam.menuWindow.color			    =	{};
GameTimeParam.menuWindow.color['date']	    =	GameTimeParam.param['Date Color In Menu'];
GameTimeParam.menuWindow.color['time']	    =	GameTimeParam.param['Time Color In Menu'];
GameTimeParam.menuWindow.frameless 		    = 	DKCore.toBool(GameTimeParam.param['Frameless Window In Menu']);
GameTimeParam.menuWindow.dateFormat         =   '#menuWindowDate#';
GameTimeParam.menuWindow.timeFormat         =   '#menuWindowTime#';

// Initialize battle window
GameTimeParam.battleWindow 				    = 	{};
GameTimeParam.battleWindow.mode 		    = 	'battle';
GameTimeParam.battleWindow.show			    =	DKCore.toBool(GameTimeParam.param['Show Window In Battle']);
GameTimeParam.battleWindow.switch		    =	Number(GameTimeParam.param['Window Switch In Battle']);
GameTimeParam.battleWindow.parameters	    = 	DKCore.StringToNumberArray(GameTimeParam.param['Window Position In Battle']);
GameTimeParam.battleWindow.windowskin	    = 	GameTimeParam.param['Window Skin In Battle'];
GameTimeParam.battleWindow.opacity 		    = 	DKCore.StringToNumberArray(GameTimeParam.param['Window Opacity In Battle']);
GameTimeParam.battleWindow.font 		    = 	{};
GameTimeParam.battleWindow.font['date']	    =	DKCore.StringToFontArray(GameTimeParam.param['Date Font In Battle']);
GameTimeParam.battleWindow.font['time']	    =	DKCore.StringToFontArray(GameTimeParam.param['Time Font In Battle']);
GameTimeParam.battleWindow.color		    =	{};
GameTimeParam.battleWindow.color['date']    =	GameTimeParam.param['Date Color In Battle'];
GameTimeParam.battleWindow.color['time']	=	GameTimeParam.param['Time Color In Battle'];
GameTimeParam.battleWindow.frameless 		= 	DKCore.toBool(GameTimeParam.param['Frameless Window In Battle']);
GameTimeParam.battleWindow.dateFormat       =   '#battleWindowDate#';
GameTimeParam.battleWindow.timeFormat       =   '#battleWindowTime#';

// Initialize day/night
GameTimeParam.tint 							= 	{};
GameTimeParam.tint.show 					= 	DKCore.toBool(GameTimeParam.param['Use Day/Night']);
GameTimeParam.tint.showOnStart              =   DKCore.toBool(GameTimeParam.param['Show Day/Night On Game Start']);
GameTimeParam.tint.dynamic 			        = 	DKCore.toBool(GameTimeParam.param['Dynamic Day/Night']);
GameTimeParam.tint.inBattle 			    = 	DKCore.toBool(GameTimeParam.param['Use Day/Night In Battle']);
GameTimeParam.tint.background			    =	DKCore.toBool(GameTimeParam.param['Show Day/Night In Map Background']);
GameTimeParam.tint.switch                   =   Number(GameTimeParam.param['Switch Day/Night']);

// Initialize variables
GameTimeParam.variables                     =   {};
GameTimeParam.variables.sec                 =   Number(GameTimeParam.param['Variable For Seconds']);
GameTimeParam.variables.min                 =   Number(GameTimeParam.param['Variable For Minutes']);
GameTimeParam.variables.hour                =   Number(GameTimeParam.param['Variable For Hours']);
GameTimeParam.variables.day                 =   Number(GameTimeParam.param['Variable For Days']);
GameTimeParam.variables.dayWeek             =   Number(GameTimeParam.param['Variable For Days Week']);
GameTimeParam.variables.month               =   Number(GameTimeParam.param['Variable For Months']);
GameTimeParam.variables.year                =   Number(GameTimeParam.param['Variable For Years']);

//===========================================================================
// DK Localization Manager
//===========================================================================

var Game_Time_DKLocalizationManager_onLocaleChange = DKLocalizationManager.onLocaleChange;
DKLocalizationManager.onLocaleChange = function(locale) {
    Game_Time_DKLocalizationManager_onLocaleChange.call(this, locale);
    if ($gameTime == null) {
        return;
    }
    var window = $gameTime.window();
    if (window) {
        window.update(true);
    }
};

DKLocalizationManager.DKCore_Game_Time_Array = function(string, index) {
    var plugin = 'DKCore_Game_Time';
    return this.DKCore_Game_Time_Object(string)[index] || '';
};

DKLocalizationManager.DKCore_Game_Time_Object = function(string) {
    var plugin = 'DKCore_Game_Time';
    return this.translation(plugin, string);
};

DKLocalizationManager.DKCore_Game_Time = function(string) {
    var plugin = 'DKCore_Game_Time';
    return string.replace(/#([^#]+)#/g, this.parser.bind(this, plugin));
};

//===========================================================================
// Game Time
//===========================================================================

function Game_Time() {
	this.initialize.apply(this, arguments);
}

Object.defineProperties(Game_Time.prototype, {
    sec: {
        get: function() {
            return this._sec;
        },
        set: function(value) {
            this.setSec(value);
        },
        configurable: true
    },
    min: {
        get: function() {
            return this._min;
        },
        set: function(value) {
            this.setMin(value);
        },
        configurable: true
    },
    hour: {
        get: function() {
            return this._hour;
        },
        set: function(value) {
            this.setHour(value);
        },
        configurable: true
    },
    day: {
        get: function() {
            return this._day;
        },
        set: function(value) {
            this.setDay(value);
        },
        configurable: true
    },
    dayWeek: {
        get: function() {
            return this._dayWeek;
        },
        set: function(value) {
            this.setDayWeek(value);
        },
        configurable: true
    },
    month: {
        get: function() {
            return this._month;
        },
        set: function(value) {
            this.setMonth(value);
        },
        configurable: true
    },
    year: {
        get: function() {
            return this._year;
        },
        set: function(value) {
            this.setYear(value);
        },
        configurable: true
    },
    timeSpeed: {
        get: function() {
            return this._timeSpeed;
        },
        set: function(value) {
            this.setTimeSpeed(value);
        },
        configurable: true
    },
    timeUpdate: {
        get: function() {
            return this._timeUpdate;
        },
        set: function(value) {
            this.setTimeUpdate(value);
        },
        configurable: true
    },
    saved: {
        get: function() {
            return this._saved;
        },
        configurable: true
    }
});

Game_Time.prototype.initialize = function(object, min, hour, day, dayWeek, month, year, timeSpeed, timeUpdate) {
    if (object && (object.constructor === Game_Time || object.constructor === Object)) {
        return this.initialize(object.sec, object.min, object.hour, object.day, object.dayWeek, object.month, object.year, object.timeSpeed, object.timeUpdate);
    }
    var sec = object;
    sec = (sec == null ? GameTimeParam.startSec : sec);
    min = (min == null ? GameTimeParam.startMin : min);
    hour = (hour == null ? GameTimeParam.startHour : hour);
    day = (day == null ? GameTimeParam.startDay : day);
    dayWeek = (dayWeek == null ? GameTimeParam.startDayWeek : dayWeek);
    month = (month == null ? GameTimeParam.startMonth : month);
    year = (year == null ? GameTimeParam.startYear : year);
    timeSpeed = (timeSpeed == null ? GameTimeParam.timeSpeed : timeSpeed);
    timeUpdate = (timeUpdate == null ? true : timeUpdate);
    this.setAll(sec, min, hour, day, dayWeek, month, year);
    this.setTimeSpeed(timeSpeed);
    this.setTimeUpdate(timeUpdate);
    this.forward();
};

// other methods

Game_Time.prototype.clone = function() {
    return new Game_Time(this);
};

Game_Time.prototype.window = function() {
    var scene = SceneManager._scene;
    if (scene) {
        return scene._gameTimeWindow;
    }
    return null;
};

Game_Time.prototype.clearTimeCount = function() {
    this._timeCount = 0;
};

Game_Time.prototype.pause = function() {
    this.setTimeUpdate(false);
};

Game_Time.prototype.resume = function() {
    this.setTimeUpdate(true);
};

Game_Time.prototype.save = function() {
    this._saved = this.clone();
};

Game_Time.prototype.load = function() {
    if (!this._saved) {
        return;
    }
    this.initialize(this._saved);
};

Game_Time.prototype.backward = function() {
    this._direction = 'backward';
};

Game_Time.prototype.forward = function() {
    this._direction = 'forward';
};

Game_Time.prototype.reverse = function() {
    this.isReversed() ? this.forward() : this.backward();
};

Game_Time.prototype.more = function(time, blockSeconds) {
    if (this._year > time.year) {
        return true;
    }
    if (this._year === time.year && this._month > time.month) {
        return true;
    }
    if (this._year === time.year && this._month === time.month && this._day > time.day) {
        return true;
    }
    if (this._year === time.year && this._month === time.month && this._day === time.day && this._hour > time.hour) {
        return true;
    }
    if (blockSeconds) {
        return this._year === time.year && this._month === time.month && this._day === time.day && this._hour === time.hour && this._min > time.min;
    } else {
        return this._year === time.year && this._month === time.month && this._day === time.day && this._hour === time.hour && this._min === time.min && this._sec > time.sec;
    }
};

Game_Time.prototype.less = function(time, blockSeconds) {
    if (this._year < time.year) {
        return true;
    }
    if (this._year === time.year && this._month < time.month)	{
        return true;
    }
    if (this._year === time.year && this._month === time.month && this._day < time.day) {
        return true;
    }
    if (this._year === time.year && this._month === time.month && this._day === time.day && this._hour < time.hour) {
        return true;
    }
    if (blockSeconds) {
        return this._year === time.year && this._month === time.month && this._day === time.day && this._hour === time.hour && this._min < time.min;
    } else {
        return this._year === time.year && this._month === time.month && this._day === time.day && this._hour === time.hour && this._min === time.min && this._sec < time.sec;
    }
};

Game_Time.prototype.moreEquals = function(time, blockSeconds) {
    return !this.less(time, blockSeconds);
};

Game_Time.prototype.lessEquals = function(time, blockSeconds) {
    return !this.more(time, blockSeconds);
};

Game_Time.prototype.equals = function(time, blockSeconds) {
    var result = (this._year === time.year && this._month === time.month && this._day === time.day && this._hour === time.hour && this._min === time.min);
    if (blockSeconds) {
        return result;
    }
    return result && this._sec === time.sec;
};

Game_Time.prototype.toString = function() {
    return 'sec: %1, min: %2, hour: %3, day: %4, dayWeek: %5, month: %6, year: %7, speed: %8'.format(this._sec, this._min, this._hour, this._day, this._dayWeek, this._month, this._year, this._timeSpeed);
};

Game_Time.prototype.print = function() {
    console.log(this.toString());
};

// set methods

Game_Time.prototype.setTime = function(object, min, hour) {
    if (object && (object.constructor === Game_Time || object.constructor === Object)) {
        return this.setTime(object.sec, object.min, object.hour);
    }
    var sec = object;
    this._sec = sec;
    this._min = min;
    this._hour = hour;
    this.clearTimeCount();
};

Game_Time.prototype.setDate = function(object, dayWeek, month, year) {
    if (object && (object.constructor === Game_Time || object.constructor === Object)) {
        return this.setDate(object.day, object.dayWeek, object.month, object.year);
    }
    var day = object;
    this._day = day;
    this._dayWeek = dayWeek;
    this._month = month;
    this._year = year;
    this.clearTimeCount();
};

Game_Time.prototype.setAll = function(object, min, hour, day, dayWeek, month, year) {
    if (object && (object.constructor === Game_Time || object.constructor === Object)) {
        return this.setAll(object.sec, object.min, object.hour, object.day, object.dayWeek, object.month, object.year);
    }
    var sec = object;
    this.setTime(sec, min, hour);
    this.setDate(day, dayWeek, month, year);
    this.clearTimeCount();
};

Game_Time.prototype.setTimeSpeed = function(speed) {
    this._timeSpeed = DKCore.MinMaxValue(1, 240, speed);
};

Game_Time.prototype.setTimeUpdate = function(update) {
    this._timeUpdate = update;
};

Game_Time.prototype.setDirection = function(direction) {
    this._direction = direction;
};

// is methods

Game_Time.prototype.isReversed = function() {
    return this._direction === 'backward';
};

Game_Time.prototype.isUpdated = function() {
    return this._timeUpdate;
};

// other methods

Game_Time.prototype.update = function() {
	if (!this.isUpdated()) {
        return;
    }
	if ($gameMessage.isBusy() && GameTimeParam.pauseTimeInMessage) {
        return;
    }
    if (GameTimeParam.realTime) {
        return this.updateRealTime();
    }
	this._timeCount++;
	if (this._timeCount % this._timeSpeed !== 0) {
        return;
    }
    if (!this.isReversed()) {
        this.addSec(1);
    } else {
        this.remSec(1);
    }
};

Game_Time.prototype.updateRealTime = function() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var daysWeekLength = this.daysInWeek();
    this._sec = date.getSeconds();
    this._min = date.getMinutes();
    this._hour = date.getHours();
    if (this._day !== day) {
        this._day = day;
        $gameTint.enableUpdateDynamicTint();
    }
    this._dayWeek = (day - 1 + daysWeekLength) % daysWeekLength; // в Date первый день - воскресенье
    if (this._month !== month) {
        this._month = month;
        $gameTint.enableUpdateDynamicTint();
    }
    this._year = date.getFullYear();
};

Game_Time.prototype.add = function(object, min, hour, day, dayWeek, month, year) {
    if (object && (object.constructor === Game_Time || object.constructor === Object)) {
        return this.add(object.sec, object.min, object.hour, object.day, object.dayWeek, object.month, object.year);
    }
    var sec = object;
    this.addSec(sec || 0);
    this.addMin(min || 0);
    this.addHour(hour || 0);
    this.addDay(day || 0, true);
    this.addDayWeek(dayWeek || 0);
    this.addMonth(month || 0);
    this.addYear(year || 0);
};

Game_Time.prototype.rem = function(object, min, hour, day, dayWeek, month, year) {
    if (object && (object.constructor === Game_Time || object.constructor === Object)) {
        return this.rem(object.sec, object.min, object.hour, object.day, object.dayWeek, object.month, object.year);
    }
    var sec = object;
    this.remSec(sec || 0);
    this.remMin(min || 0);
    this.remHour(hour || 0);
    this.remDay(day || 0, true);
    this.remDayWeek(dayWeek || 0);
    this.remMonth(month || 0);
    this.remYear(year || 0);
};

Game_Time.prototype.secondsInMinute = function() {
    return GameTimeParam.secondsInMinute;
};

Game_Time.prototype.minutesInHour = function() {
    return GameTimeParam.minutesInHour;
};

Game_Time.prototype.hoursInDay = function() {
    return GameTimeParam.hoursInDay;
};

Game_Time.prototype.daysInWeek = function() {
    return DKLocalizationManager.DKCore_Game_Time_Object('daysWeek').length;
};

Game_Time.prototype.daysInMonth = function() {
    return GameTimeParam.daysInMonth[this._month];
};

Game_Time.prototype.monthsInYear = function() {
    return DKLocalizationManager.DKCore_Game_Time_Object('months').length;
};

// add methods

Game_Time.prototype.calculateAddValues = function(nowValue, value, length) {
    var values = [];
    value += nowValue;
    values[0] = value % length; // new value
    values[1] = Math.floor(value / length); // next add value
    return values;
};

Game_Time.prototype.addSec = function(sec) {
    if (!Number(sec) || sec === 0) {
        return;
    }
    var length = this.secondsInMinute();
    var values = this.calculateAddValues(this._sec, sec, length);
    this._sec = values[0]; // new value
    this.addMin(values[1]); // next add value
};

Game_Time.prototype.addMin = function(min) {
    if (!Number(min) || min === 0) {
        return;
    }
    var length = this.minutesInHour();
    var values = this.calculateAddValues(this._min, min, length);
    this._min = values[0]; // new value
    this.addHour(values[1]); // next add value
};

Game_Time.prototype.addHour = function(hour) {
    if (!Number(hour) || hour === 0) {
        return;
    }
    var length = this.hoursInDay();
    var values = this.calculateAddValues(this._hour, hour, length);
    this._hour = values[0]; // new value
    this.addDay(values[1]); // next add value
};

Game_Time.prototype.addDayWeek = function(dayWeek) {
    if (!Number(dayWeek) || dayWeek === 0) {
        return;
    }
    var length = this.daysInWeek();
    this._dayWeek = (this._dayWeek + dayWeek) % length;
};

Game_Time.prototype.addDay = function(day, block) {
    if (!Number(day) || day === 0) {
        return;
    }
    var length = this.daysInMonth() + 1;
    if (this._day + day < length) {
        this._day += day;
        if (!block) {
            this.addDayWeek(day);
        }
    } else {
        this._day++;
        if (!block) {
            this.addDayWeek(1);
        }
        if (this._day === length) {
            this._day = 1;
            this.addMonth(1);
        }
        return this.addDay(day - 1);
    }
    $gameTint.enableUpdateDynamicTint();
};

Game_Time.prototype.addMonth = function(month) {
    if (!Number(month) || month === 0) {
        return;
    }
    var length = this.monthsInYear();
    var values = this.calculateAddValues(this._month, month, length);
    this._month = values[0];
    this.addYear(values[1]);
    $gameTint.enableUpdateDynamicTint();
};

Game_Time.prototype.addYear = function(year) {
    if (!Number(year) || year === 0) {
        return;
    }
	this._year += year;
};

// rem methods

Game_Time.prototype.calculateRemValues = function(nowValue, value, length) {
    var values = [];
    values[0] = ((length + nowValue) - value % length) % length; // new value
    values[1] = Math.floor((length - nowValue + value) / length); // next rem value
    return values;
};

Game_Time.prototype.remSec = function(sec) {
    if (!Number(sec) || sec === 0) {
        return;
    }
    if (sec > this._sec) {
        var length = this.secondsInMinute();
        var values = this.calculateRemValues(this._sec, sec, length);
        this._sec = values[0]; // new value
        this.remMin(values[1]); // next rem value
    } else {
        this._sec -= sec;
    }
};

Game_Time.prototype.remMin = function(min) {
    if (!Number(min) || min === 0) {
        return;
    }
    if (min > this._min) {
        var length = this.minutesInHour();
        var values = this.calculateRemValues(this._min, min, length);
        this._min = values[0]; // new value
        this.remHour(values[1]); // next rem value
    } else {
        this._min -= min;
    }
};

Game_Time.prototype.remHour = function(hour) {
    if (!Number(hour) || hour === 0) {
        return;
    }
    if (hour > this._hour) {
        var length = this.hoursInDay();
        var values = this.calculateRemValues(this._hour, hour, length);
        this._hour = values[0]; // new value
        this.remDay(values[1]); // next rem value
    } else {
        this._hour -= hour;
    }
};

Game_Time.prototype.remDayWeek = function(dayWeek) {
    if (!Number(dayWeek) || dayWeek === 0) {
        return;
    }
    var length = this.daysInWeek();
    this._dayWeek = (length + this._dayWeek - dayWeek % length) % length;
};

Game_Time.prototype.remDay = function(day, block) {
    if (!Number(day) || day === 0) {
        return;
    }
    if (day >= this._day) {
        if (this._day === 1) {
            this.remMonth(1);
            if (!block) {
                this.remDayWeek(1);
            }
            this._day = this.daysInMonth();
        } else {
            this._day--;
            if (!block) {
                this.remDayWeek(1);
            }
            return this.remDay(day - 1);
        }
    }
    else {
        this._day -= day;
        if (!block) {
            this.remDayWeek(day);
        }
    }
    $gameTint.enableUpdateDynamicTint();
};

Game_Time.prototype.remMonth = function(month) {
    if (!Number(month) || month === 0) {
        return;
    }
    if (month > this._month) {
        var length = this.monthsInYear();
        var values = this.calculateRemValues(this._month, month, length);
        this._month = values[0]; // new value
        this.remYear(values[1]); // next rem value
    } else {
        this._month -= month;
    }
    $gameTint.enableUpdateDynamicTint();
};

Game_Time.prototype.remYear = function(year) {
    if (!Number(year) || year === 0) {
        return;
    }
	this._year -= year;
};

// set methods

Game_Time.prototype.setSec = function(sec) {
	this._sec = DKCore.MinMaxValue(0, this.secondsInMinute() - 1, sec);
};

Game_Time.prototype.setMin = function(min) {
	this._min = DKCore.MinMaxValue(0, this.minutesInHour() - 1, min);
};

Game_Time.prototype.setHour = function(hour) {
	this._hour = DKCore.MinMaxValue(0, this.hoursInDay() - 1, hour);
};

Game_Time.prototype.setDayWeek = function(dayWeek) {
    this._dayWeek = DKCore.MinMaxValue(0, this.daysInWeek() - 1, dayWeek);
};

Game_Time.prototype.setDay = function(day) {
	this._day = DKCore.MinMaxValue(1, this.daysInMonth(), day);
    $gameTint.enableUpdateDynamicTint();
};

Game_Time.prototype.setMonth = function(month) {
	this._month = DKCore.MinMaxValue(0, this.monthsInYear() - 1, month);
    $gameTint.enableUpdateDynamicTint();
};

Game_Time.prototype.setYear = function(year) {
	this._year = year;
};

//=============================================================================
// Game Tint
//=============================================================================

function Game_Tint() {
	this.initialize.apply(this, arguments);
}

Game_Tint.prototype = Object.create(Sprite.prototype);
Game_Tint.prototype.constructor = Game_Tint;

Game_Tint.prototype.initialize = function() {
	Sprite.prototype.initialize.call(this, new Bitmap(Graphics.boxWidth, Graphics.boxHeight));
    this._gameTime = $gameTime.clone();
	this._tintUpdate = true;
	this._updateDynamicTint = true;
	this._staticHour = -1;
};

Game_Tint.prototype.enableUpdateDynamicTint = function() {
    if (!GameTimeParam.tint.show || !GameTimeParam.tint.dynamic) {
        return;
    }
	this._updateDynamicTint = true;
	this.update();
};

// set methods

Game_Tint.prototype.setTintUpdate = function(update) {
    this._tintUpdate = update;
};

Game_Tint.prototype.setStaticHour = function(hour) {
    hour = (hour == null ? -1 : hour);
	var lastHour = this._staticHour;
	this._staticHour = hour;
	if (this._staticHour === lastHour) {
        return;
    }
	this.update();
};

// other methods

Game_Tint.prototype.show = function() {
    this.visible = true;
};

Game_Tint.prototype.hide = function() {
    this.visible = false;
};

Game_Tint.prototype.pause = function () {
    this.setTintUpdate(false);
};

Game_Tint.prototype.resume = function () {
    this.setTintUpdate(true);
};

Game_Tint.prototype.makeSaveContents = function() {
    return {
        gameTime: this._gameTime,
        tintUpdate: this._tintUpdate,
        staticUpdate: this._staticHour
    };
};

Game_Tint.prototype.extractSaveContents = function(object) {
    if (object.gameTime) {
        this._gameTime = object.gameTime;
    }
    if (object.tintUpdate) {
        this._tintUpdate = object.tintUpdate;
    }
    if (object.staticUpdate) {
        this._staticHour = object.staticUpdate;
    }
};

// is methods

Game_Tint.prototype.isUpdated = function() {
    return this._tintUpdate;
};

Game_Tint.prototype.isVisible = function() {
    return this.visible;
};

// update methods

Game_Tint.prototype.update = function() {
	if (!this.isUpdated()) {
        return;
    }
    if (this._staticHour === -1) {
        if (this._gameTime.equals($gameTime, true)) {
            return;
        }
        this._gameTime = $gameTime.clone();
    }
    this.defaultTint();
};

Game_Tint.prototype.settings = function() {
	this._min = $gameTime.min;
	this._hour = $gameTime.hour;
	this._month = $gameTime.month;
	if (this._staticHour !== -1) {
		this._min = $gameTime.minutesInHour() / 2;
		this._hour = this._staticHour;
	}
	this.updateDynamicTint();
    this.updateCurrentHour();
    this.updateNextHour();
};

Game_Tint.prototype.updateDynamicTint = function() {
    if (!GameTimeParam.tint.dynamic || !this._updateDynamicTint) {
        return;
    }
    this._dymanicTint = [];
    var minus = 7;
    var noZero = 6 + minus * 1.5;
    for(var i = 0; i < 24; i++) {
        this._dymanicTint[i] = [
            this.getDynamicRed(i, this._month) - minus + Math.randomInt(noZero),
            this.getDynamicGreen(i, this._month) - minus + Math.randomInt(noZero),
            this.getDynamicBlue(i, this._month) - minus + Math.randomInt(noZero),
            this.getDynamicOpacity(i, this._month)
        ];
    }
    this._updateDynamicTint = false;
};

Game_Tint.prototype.updateCurrentHour = function() {
    this._currentHour = GameTimeParam.tint.dynamic ? this._dymanicTint[this._hour] : GAME_TIME_TINTS[this._hour];
};

Game_Tint.prototype.updateNextHour = function() {
    var hour = (this._hour + 1) % $gameTime.hoursInDay();
    this._nextHour = GameTimeParam.tint.dynamic ? this._dymanicTint[hour] : GAME_TIME_TINTS[hour];
};

Game_Tint.prototype.getTint = function() {
	var rgb = [];
	for(var i = 0; i < 3; i++) {
        rgb[i] = DKCore.MinMaxValue(0, 255, this._currentHour[i] + (this._nextHour[i] - this._currentHour[i]) / 60 * this._min);
    }
	return rgb;
};

Game_Tint.prototype.getOpacity = function() {
	return DKCore.MinMaxValue(0, 255, (this._currentHour[3] + (this._nextHour[3] - this._currentHour[3]) / 60 * this._min) * 1.1);
};

Game_Tint.prototype.defaultTint = function() {
	this.settings();
	this.bitmap.clear();
	this.bitmap.fillRect(0, 0, this.bitmap.width, this.bitmap.height, this.getTint());
	this.opacity = this.getOpacity();
};

Game_Tint.prototype.getDynamicRed = function(hour, month) {
	var red = [];
	red[0] = [0, 0, 0, 0, 0, 10, 20, 60, 100, 70, 20, 10, 0, 0, 20, 40, 100, 80, 50, 20, 10, 0, 0, 0];
	red[1] = [0, 0, 0, 0, 0, 5, 10, 20, 30, 20, 10, 0, 0, 0, 10, 15, 20, 25, 15, 10, 0, 0, 0, 0],
	red[2] = [0, 0, 0, 0, 5, 10, 20, 30, 20, 10, 0, 0, 0, 0, 0, 5, 10, 25, 10, 5, 0, 0, 0, 0];
	red[3] = [0, 0, 0, 0, 5, 10, 30, 20, 10, 5, 0, 0, 0, 0, 0, 0, 0, 10, 15, 30, 15, 10, 0, 0];
	red[4] = [0, 0, 0, 10, 15, 30, 15, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 25, 15, 10, 0];
	red[5] = [0, 0, 10, 20, 30, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 30, 15, 0];
	red[6] = [0, 0, 10, 15, 30, 15, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 15, 0];
	red[7] = [0, 0, 0, 10, 20, 30, 15, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 20, 10, 0];
	red[8] = [0, 0, 0, 0, 10, 20, 30, 15, 10, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 15, 10, 0, 0];
	red[9] = [0, 0, 0, 0, 0, 10, 15, 30, 10, 0, 0, 0, 0, 0, 0, 5, 15, 25, 15, 10, 0, 0, 0, 0];
	red[10] = [0, 0, 0, 0, 0, 10, 20, 30, 20, 10, 0, 0, 0, 0, 10, 20, 30, 20, 10, 0, 0, 0, 0, 0];
	red[11] = [0, 0, 0, 0, 0, 0, 10, 15, 30, 15, 10, 0, 0, 0, 10, 15, 30, 15, 10, 0, 0, 0, 0, 0];
	return red[month][hour];
};

Game_Tint.prototype.getDynamicGreen = function(hour, month) {
	var green = [];
	green[0] = [0, 0, 0, 0, 0, 5, 10, 20, 30, 20, 10, 0, 0, 0, 10, 15, 25, 15, 10, 0, 0, 0, 0, 0];
	green[1] = [0, 0, 0, 0, 0, 5, 10, 20, 30, 20, 10, 0, 0, 0, 10, 15, 20, 25, 15, 10, 0, 0, 0, 0];
	green[2] = [0, 0, 0, 0, 5, 10, 20, 30, 20, 10, 0, 0, 0, 0, 0, 5, 10, 25, 10, 5, 0, 0, 0, 0];
	green[3] = [0, 0, 0, 0, 5, 10, 30, 20, 10, 5, 0, 0, 0, 0, 0, 0, 0, 10, 15, 30, 15, 10, 0, 0];
	green[4] = [0, 0, 0, 10, 15, 30, 15, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 25, 15, 10, 0];
	green[5] = [0, 0, 10, 20, 30, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 30, 15, 0];
	green[6] = [0, 0, 10, 15, 30, 15, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 15, 0];
	green[7] = [0, 0, 0, 10, 20, 30, 15, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 20, 10, 0];
	green[8] = [0, 0, 0, 0, 10, 20, 30, 15, 10, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 15, 10, 0, 0];
	green[9] = [0, 0, 0, 0, 0, 10, 15, 30, 10, 0, 0, 0, 0, 0, 0, 5, 15, 25, 15, 10, 0, 0, 0, 0];
	green[10] = [0, 0, 0, 0, 0, 10, 20, 30, 20, 10, 0, 0, 0, 0, 10, 20, 30, 20, 10, 0, 0, 0, 0, 0];
	green[11] = [0, 0, 0, 0, 0, 0, 10, 15, 30, 15, 10, 0, 0, 0, 10, 15, 30, 15, 10, 0, 0, 0, 0, 0];
	return green[month][hour];
};

Game_Tint.prototype.getDynamicBlue = function(hour, month) {
	var blue = [];
	blue[0] = [10, 15, 20, 25, 30, 45, 30, 20, 10, 0, 0, 0, 0, 0, 0, 15, 20, 55, 45, 30, 20, 10, 0, 0];
	blue[1] = [10, 15, 20, 25, 30, 40, 20, 15, 10, 0, 0, 0, 0, 0, 0, 0, 15, 20, 55, 45, 30, 20, 10, 0];
	blue[2] = [10, 15, 25, 30, 40, 30, 20, 15, 10, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 50, 45, 40, 35, 20];
	blue[3] = [15, 20, 20, 35, 45, 25, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 25, 35, 50, 40, 35, 20];
	blue[4] = [15, 20, 35, 45, 25, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 35, 55, 40, 30];
	blue[5] = [15, 30, 50, 35, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 50, 30];
	blue[6] = [15, 30, 50, 30, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 50, 25];
	blue[7] = [10, 15, 30, 50, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 35, 50, 35, 20];
	blue[8] = [10, 15, 25, 35, 50, 30, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 55, 35, 20, 15];
	blue[9] = [10, 15, 20, 25, 35, 50, 30, 20, 10, 0, 0, 0, 0, 0, 0, 10, 20, 35, 55, 40, 30, 20, 15, 10];
	blue[10] = [10, 10, 15, 20, 35, 55, 35, 20, 10, 0, 0, 0, 0, 10, 20, 30, 40, 55, 35, 20, 15, 15, 10, 10];
	blue[11] = [10, 15, 20, 25, 35, 55, 35, 20, 10, 0, 0, 0, 0, 10, 20, 30, 45, 60, 40, 30, 20, 15, 15, 10];
	return blue[month][hour];
};

Game_Tint.prototype.getDynamicOpacity = function(hour, month) {
	var opacity = [];
	opacity[0] = [175, 170, 160, 160, 150, 150, 145, 140, 120, 90, 55, 20, 10, 10, 10, 15, 25, 75, 105, 135, 155, 160, 165, 180];
	opacity[1] = [170, 165, 155, 150, 140, 130, 130, 125, 110, 80, 50, 20, 10, 10, 10, 15, 25, 70, 95, 125, 140, 150, 160, 175];
	opacity[2] = [165, 160, 150, 135, 130, 110, 115, 110, 90, 70, 45, 20, 10, 10, 10, 10, 20, 60, 80, 105, 120, 135, 150, 160];
	opacity[3] = [160, 150, 140, 120, 120, 100, 90, 85, 70, 60, 40, 15, 10, 10, 10, 10, 20, 40, 60, 85, 100, 120, 135, 150];
	opacity[4] = [155, 140, 130, 110, 105, 85, 75, 70, 50, 45, 35, 15, 10, 10, 10, 10, 10, 20, 40, 70, 85, 110, 125, 140];
	opacity[5] = [150, 130, 120, 100, 90, 70, 55, 50, 40, 30, 35, 10, 10, 10, 10, 10, 10, 15, 25, 55, 65, 100, 105, 130];
	opacity[6] = [145, 120, 110, 110, 100, 80, 70, 65, 55, 40, 35, 10, 10, 10, 10, 10, 10, 25, 40, 70, 80, 110, 125, 140];
	opacity[7] = [150, 130, 120, 120, 110, 100, 85, 80, 70, 50, 40, 15, 10, 10, 10, 10, 10, 40, 60, 80, 100, 120, 130, 140];
	opacity[8] = [155, 140, 130, 130, 120, 110, 100, 95, 85, 60, 45, 15, 10, 10, 10, 10, 10, 50, 70, 90, 115, 130, 140, 150];
	opacity[9] = [160, 150, 140, 140, 130, 120, 115, 110, 100, 70, 50, 20, 10, 10, 10, 10, 15, 60, 80, 100, 130, 140, 150, 155];
	opacity[10] = [165, 160, 150, 150, 140, 130, 130, 125, 110, 80, 55, 20, 10, 10, 10, 15, 20, 70, 90, 115, 145, 150, 155, 160];
	opacity[11] = [170, 170, 160, 160, 150, 150, 145, 140, 120, 90, 60, 25, 10, 10, 10, 15, 25, 75, 105, 135, 155, 160, 165, 170];
	return opacity[month][hour];
};

//=============================================================================
// Window Game Time
//=============================================================================

function Window_Game_Time() {
    this.initialize.apply(this, arguments);
}

Window_Game_Time.prototype = Object.create(Window_Base.prototype);
Window_Game_Time.prototype.constructor = Window_Game_Time;

Window_Game_Time.prototype.initialize = function(preset, gameTime) {
	this._preset = preset || {};
    this._preset.parameters = this._preset.parameters || [0, 0];
    this._gameTime = gameTime || $gameTime;
    this.clearBlinkCount();
    this.updateVariables();
    var x = this._preset.parameters[0];
    var y = this._preset.parameters[1];
    var width = this._preset.parameters[2] || this.standardWidth();
    var height = this._preset.parameters[3] || this.standardHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
	DKCore.setupWindow(this, preset);
    this.update(true);
};

Window_Game_Time.prototype.clearBlinkCount = function() {
    this._blinkCount = 0;
};

Window_Game_Time.prototype.standardWidth = function() {
    return 100;
};

Window_Game_Time.prototype.standardHeight = function() {
    return this.standardPadding() * 2 + this.lineHeight() * 2;
};

Window_Game_Time.prototype.isAmPm = function() {
    if (!this._preset.timeFormat) {
        return false;
    }
    var time = DKLocalizationManager.DKCore_Game_Time(this._preset.timeFormat);
    return time.contains('%am');
};

Window_Game_Time.prototype.getSeconds = function() {
    return this._gameTime.sec.padZero(2);
};

Window_Game_Time.prototype.getMinutes = function() {
    return this._gameTime.min.padZero(2);
};

Window_Game_Time.prototype.getHours = function() {
    var hour = this._gameTime.hour;
    if (this.isAmPm()) {
        if (hour > 12 && hour <= 23) {
            hour -= 12;
        } else if (hour === 0) {
            hour += 12;
        }
    }
    return hour.padZero(2);
};

Window_Game_Time.prototype.getDay = function(short) {
    return short ? this._gameTime.day : this._gameTime.day.padZero(2);
};

Window_Game_Time.prototype.getMonth = function(short) {
    var month = this._gameTime.month + 1;
    return short ? month : month.padZero(2);
};

Window_Game_Time.prototype.getYear = function(short) {
    return this._gameTime.year < 100 || !short ? this._gameTime.year : this._gameTime.year % 100;
};

Window_Game_Time.prototype.getBlink = function() {
    if (this._preset.mode === 'map' && GameTimeParam.disabledMaps['update'].contains($gameMap.mapId())) {
        return ':';
    }
	if (SceneManager._nextScene != null) {
        return ':';
    }
	if ($gameMessage.isBusy() && GameTimeParam.pauseTimeInMessage) {
        return ':';
    }
	if (GameTimeParam.blinkSpeed === -1) {
        return ':';
    }
	if (SceneManager._scene instanceof Scene_Menu && !GameTimeParam.updateTimeInMenu) {
        return ':';
    }
	if (SceneManager._scene instanceof Scene_Battle && !GameTimeParam.updateTimeInBattle) {
        return ':';
    }
	if (!this._gameTime.isUpdated()) {
        return ':';
    }
    if (this._blinkCount % GameTimeParam.blinkSpeed >= GameTimeParam.blinkSpeed / 2) {
        return ':';
    }
	return ' ';
};

Window_Game_Time.prototype.getAmPm = function() {
    var hour = this._gameTime.hour;
    var type = (hour < 12 ? '#am#' : '#pm#');
    return DKLocalizationManager.DKCore_Game_Time(type);
};

Window_Game_Time.prototype.getDate = function() {
    if (!this._preset.dateFormat) {
        return '';
    }
	var date = DKLocalizationManager.DKCore_Game_Time(this._preset.dateFormat);
    date = date.replace(/%day_week/g, DKLocalizationManager.DKCore_Game_Time_Array('daysWeek', this._gameTime.dayWeek)); ////////
    date = date.replace(/%day_short/g, this.getDay());
    date = date.replace(/%day/g, this.getDay());
    date = date.replace(/%month_str/g, DKLocalizationManager.DKCore_Game_Time_Array('months', this._gameTime.month));
    date = date.replace(/%month_num_short/g, this.getMonth(true));
    date = date.replace(/%month_num/g, this.getMonth());
    date = date.replace(/%year_short/g, this.getYear(true));
    date = date.replace(/%year/g, this.getYear());
	return date;
};

Window_Game_Time.prototype.getTime = function() {
    if (!this._preset.timeFormat) {
        return '';
    }
	var time = DKLocalizationManager.DKCore_Game_Time(this._preset.timeFormat);
    time = time.replace(/%hour/g, this.getHours());
    time = time.replace(/%min/g, this.getMinutes());
    time = time.replace(/%sec/g, this.getSeconds());
    time = time.replace(/:/g, this.getBlink());
    time = time.replace(/%am/g, this.getAmPm());
	return time;
};

Window_Game_Time.prototype.dateColor = function() {
	if (this._preset.color && this._preset.color['date']) {
        return this._preset.color['date'];
    }
	return '#ffffff';
};

Window_Game_Time.prototype.timeColor = function() {
	if (this._preset.color && this._preset.color['time']) {
        return this._preset.color['time'];
    }
	return '#ffffff';
};

Window_Game_Time.prototype.drawDate = function(date, y) {
    if (this._preset.font) {
        DKCore.setupFont(this, this._preset.font['date']);
    }
    this.changeTextColor(this.dateColor());
    var align = this._preset.date_align || 'center';
    this.drawText(date, 0, y, this.contentsWidth(), align);
};

Window_Game_Time.prototype.drawTime = function(time, y) {
    if (this._preset.font) {
        DKCore.setupFont(this, this._preset.font['time']);
    }
    this.changeTextColor(this.timeColor());
    var align = this._preset.time_align || 'center';
    this.drawText(time, 0, y, this.contentsWidth(), align);
};

Window_Game_Time.prototype.drawGameTime = function() {
    var date = this.getDate();
    var time = this.getTime();
    if (date !== '' && time !== '') {
        var y = (this.contentsHeight() - this.lineHeight() * 2) / 2;
        this.drawDate(date, y);
        this.drawTime(time, y + this.lineHeight());
    }
    var y = (this.contentsHeight() - this.lineHeight()) / 2;
    if (date !== '' && time === '') {
        this.drawDate(date, y);
    }
    if (date === '' && time !== '') {
        this.drawTime(time, y);
    }
};

Window_Game_Time.prototype.setUpdateHandler = function(method) {
    this._preset._updateHandler = method;
};

Window_Game_Time.prototype.callUpdateHandler = function() {
    if (this._preset._updateHandler) {
        this._preset._updateHandler(this, this._gameTime);
    }
};

Window_Game_Time.prototype.isVisible = function() {
    return this.visible;
};

Window_Game_Time.prototype.needsUpdate = function() {
    return false;
};

Window_Game_Time.prototype.update = function(update) {
    this._blinkCount++;
	if (update || this.needsUpdate() || !this._gameTime.equals(this._gameTimeClone, !GameTimeParam.showSeconds) || GameTimeParam.blinkSpeed !== -1) {
		this.contents.clear();
		this.updateVariables();
		this.drawGameTime();
        this.callUpdateHandler();
	}
};

Window_Game_Time.prototype.updateVariables = function() {
    this._gameTimeClone = this._gameTime.clone();
};

//=============================================================================
// Scene Base
//=============================================================================

Scene_Base.prototype.createGameTimeWindow = function(preset, gameTime) {
	this.removeGameTimeWindow();
	this._gameTimeWindow = new Window_Game_Time(preset, gameTime);
	this.addWindow(this._gameTimeWindow);
};

Scene_Base.prototype.removeGameTimeWindow = function() {
	if (this._gameTimeWindow == null) {
        return;
    }
	this._windowLayer.removeChild(this._gameTimeWindow);
	this._gameTimeWindow = null;
};

Scene_Base.prototype.showGameTimeWindow = function() {
    if (this._gameTimeWindow == null) {
        return;
    }
    this._gameTimeWindow.show();
};

Scene_Base.prototype.hideGameTimeWindow = function() {
    if (this._gameTimeWindow == null) {
        return;
    }
    this._gameTimeWindow.hide();
};

Scene_Base.prototype.removeGameTintFromChild = function() {
	if (this._spriteset == null || this._spriteset._baseSprite == null) {
        return;
    }
	this._spriteset._baseSprite.removeChild($gameTint);
};

Scene_Base.prototype.showGameTint = function() {
    $gameTint.show();
};

Scene_Base.prototype.hideGameTint = function() {
    $gameTint.hide();
};

Scene_Base.prototype.setGameTimeWindowVisible = function(visible) {
    if (this._gameTimeWindow == null) {
        return;
    }
    visible ? this.showGameTimeWindow() : this.hideGameTimeWindow();
    $gameSystem.gameTimeShow = visible;
};

Scene_Base.prototype.setGameTintVisible = function(visible) {
    if ($gameTint == null) {
        return;
    }
    visible ? this.showGameTint() : this.hideGameTint();
    $gameSystem.gameTintShow = visible;
};

Scene_Base.prototype.checkGameTimeVariables = function () {
    if ($gameVariables == null) {
        return;
    }
    for(var key in GameTimeParam.variables) {
        var id = GameTimeParam.variables[key];
        if (id < 1) {
            continue;
        }
        var value = $gameVariables.value(id);
        var gameTimeValue = $gameTime[key];
        if (value !== gameTimeValue) {
            $gameVariables.setValue(id, gameTimeValue);
        }
    }
};

Scene_Base.prototype.checkGameTimeWindowSwitch = function(preset) {
    var id = preset.switch;
    if (id < 1) {
        return;
    }
    var value = $gameSwitches.value(id);
    this.setGameTimeWindowVisible(value);
};

Scene_Base.prototype.checkGameTintSwitch = function() {
    var id = GameTimeParam.tint.switch;
    if (id < 1) {
        return;
    }
    var value = $gameSwitches.value(id);
    this.setGameTintVisible(value);
};

var Game_Time_Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
    Game_Time_Scene_Base_update.call(this);
    this.checkGameTimeVariables();
};

//=============================================================================
// Scene Map
//=============================================================================

var Game_Time_Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	Game_Time_Scene_Map_onMapLoaded.call(this);
    if (GameTimeParam.tint.show && !GameTimeParam.disabledMaps['tint'].contains($gameMap.mapId())) {
        this.setGameTintVisible($gameSystem.gameTintShow);
    }
};

 var Game_Time_Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
	Game_Time_Scene_Map_createAllWindows.call(this);
    if (GameTimeParam.mapWindow.show && !GameTimeParam.disabledMaps['window'].contains($gameMap.mapId())) {
        this.createGameTimeWindow(GameTimeParam.mapWindow);
        this.setGameTimeWindowVisible($gameSystem.gameTimeShow);
    }
};

var Game_Time_Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	Game_Time_Scene_Map_update.call(this);
    if (!GameTimeParam.disabledMaps['update'].contains($gameMap.mapId())) {
        $gameTime.update();
    }
	if (GameTimeParam.mapWindow.button !== '-1' && Input.isTriggered(GameTimeParam.mapWindow.button)) {
        this.setGameTimeWindowVisible(!$gameSystem.gameTimeShow);
    }
    if (GameTimeParam.mapWindow.show) {
        this.checkGameTimeWindowSwitch(GameTimeParam.mapWindow);
    }
    if (GameTimeParam.tint.show) {
        this.checkGameTintSwitch();
    }
};

var Game_Time_Scene_Map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function() {
    this.removeGameTimeWindow();
    if (GameTimeParam.tint.show && !GameTimeParam.tint.background) {
        this.removeGameTintFromChild();
    }
	Game_Time_Scene_Map_terminate.call(this);
};

//=============================================================================
// Scene Menu
//=============================================================================

var Game_Time_Scene_Menu_create = Scene_Menu.prototype.create;
Scene_Menu.prototype.create = function() {
	Game_Time_Scene_Menu_create.call(this);
	if (GameTimeParam.menuWindow.show) {
        this.createGameTimeWindow(GameTimeParam.menuWindow);
        this.checkGameTimeWindowSwitch(GameTimeParam.menuWindow);
    }
};

var Game_Time_Scene_Menu_update = Scene_Menu.prototype.update;
Scene_Menu.prototype.update = function() {
    Game_Time_Scene_Menu_update.call(this);
    if (GameTimeParam.updateTimeInMenu) {
        $gameTime.update();
    }
};

//=============================================================================
// Scene Battle
//=============================================================================

var Game_Time_Scene_Battle_create = Scene_Battle.prototype.create;
Scene_Battle.prototype.create = function() {
	Game_Time_Scene_Battle_create.call(this);
	if (GameTimeParam.tint.show && GameTimeParam.tint.inBattle) {
        this.setGameTintVisible($gameSystem.gameTintShow);
    }
};

var Game_Time_Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
	Game_Time_Scene_Battle_createAllWindows.call(this);
	if (GameTimeParam.battleWindow.show) {
        this.createGameTimeWindow(GameTimeParam.battleWindow);
        this.setGameTimeWindowVisible($gameSystem.gameTimeShow);
    }
};

var Game_Time_Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
	Game_Time_Scene_Battle_update.call(this);
    if (GameTimeParam.updateTimeInBattle) {
        $gameTime.update();
    }
    if (GameTimeParam.battleWindow.show) {
        this.checkGameTimeWindowSwitch(GameTimeParam.battleWindow);
    }
    if (GameTimeParam.tint.show) {
        this.checkGameTintSwitch();
    }
};

//=============================================================================
// Spriteset Base
//=============================================================================

Spriteset_Base.prototype.addGameTintToChild = function() {
    if (this._baseSprite == null) {
        return;
    }
    this._baseSprite.addChild($gameTint);
};

//=============================================================================
// Spriteset Map
//=============================================================================

var Game_Time_Spriteset_Map_createTilemap = Spriteset_Map.prototype.createTilemap;
Spriteset_Map.prototype.createTilemap = function() {
    Game_Time_Spriteset_Map_createTilemap.call(this);
    if (GameTimeParam.tint.show && !GameTimeParam.disabledMaps['tint'].contains($gameMap.mapId())) {
        this.addGameTintToChild();
    }
};

//=============================================================================
// Spriteset Battle
//=============================================================================

var Game_Time_Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
Spriteset_Battle.prototype.createLowerLayer = function() {
    Game_Time_Spriteset_Battle_createLowerLayer.call(this);
    if (GameTimeParam.tint.show && GameTimeParam.tint.inBattle) {
        this.addGameTintToChild();
    }
};

//=============================================================================
// Game System
//=============================================================================

var Game_Time_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Game_Time_Game_System_initialize.call(this);
	this.gameTimeShow = GameTimeParam.mapWindow.show && GameTimeParam.mapWindow.showOnStart;
	this.gameTintShow = GameTimeParam.tint.showOnStart;
};

//=============================================================================
// Game Interpreter
//=============================================================================

var Game_Time_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Game_Time_Game_Interpreter_pluginCommand.call(this, command, args);
    switch(command) {
        case 'SaveGameTime':
            $gameTime.save();
            break;
        case 'LoadGameTime':
            $gameTime.load();
            break;
        case 'ResetGameTime':
            $gameTime = new Game_Time();
            break;
        case 'SetGameTimeSpeed':
            $gameTime.setTimeSpeed(Number(args[0]));
            break;
        case 'SetGameTime':
            if (args.length === 2) {
                var type = args[0].toLowerCase();
                var value = Number(args[1]);
                switch(type) {
                    case 'sec':     return $gameTime.setSec(value);
                    case 'min':     return $gameTime.setMin(value);
                    case 'hour':    return $gameTime.setHour(value);
                    case 'day':     return $gameTime.setDay(value);
                    case 'dayWeek': return $gameTime.setDayWeek(value);
                    case 'month':   return $gameTime.setMonth(value);
                    case 'year':    return $gameTime.setYear(value);
                }
            } else if (args.length === 7) {
                $gameTime.setAll(Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]), Number(args[5]), Number(args[6]));
            }
            break;
        case 'ChangeGameTime':
            var type = args[0].toLowerCase();
            var value = Number(args[1]);
            type = type.charAt(0).toUpperCase() + type.substr(1);
            var text = value > 0 ? 'add' : 'rem';
            var command = '$gameTime.%1%2(%3)'.format(text, type, value);
            eval(command);
            break;
        case 'PauseGameTimeUpdate':
            $gameTime.pause();
            break;
        case 'ResumeGameTimeUpdate':
            $gameTime.resume();
            break;
        case 'SetGameTimeUpdate':
            $gameTime.setTimeUpdate(DKCore.toBool(args[0]));
            break;
        case 'GameTimeForward':
            $gameTime.forward();
            break;
        case 'GameTimeBackward':
            $gameTime.backward();
            break;
        case 'SetGameTimeDirection':
            $gameTime.setDirection(args[0]);
            break;
        case 'ReverseGameTime':
            $gameTime.reverse();
            break;
        case 'ShowGameTimeWindow':
            SceneManager._scene.setGameTimeWindowVisible(true);
            break;
        case 'HideGameTimeWindow':
            SceneManager._scene.setGameTimeWindowVisible(false);
            break;
        case 'SetGameTimeWindowVisible':
            SceneManager._scene.setGameTimeWindowVisible(DKCore.toBool(args[0]));
            break;
        case 'PauseGameTintUpdate':
            $gameTint.pause();
            break;
        case 'ResumeGameTintUpdate':
            $gameTint.resume();
            break;
        case 'ShowGameTint':
            SceneManager._scene.setGameTintVisible(true);
            break;
        case 'HideGameTint':
            SceneManager._scene.setGameTintVisible(false);
            break;
        case 'SetGameTintVisible':
            SceneManager._scene.setGameTintVisible(DKCore.toBool(args[0]));
            break;
        case 'SetGameTintStaticHour':
            $gameTint.setStaticHour(Number(args[0]));
            break;
    }
};

Game_Interpreter.prototype.setGameTime = function(time) {
    $gameTime = new Game_Time(time);
};

//=============================================================================
// Data Manager
//=============================================================================

var Game_Time_DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
	Game_Time_DataManager_createGameObjects.call(this);
	$gameTime = new Game_Time();
    $gameTime.save();
	$gameTint = new Game_Tint();
};

var Game_Time_DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
	var contents = Game_Time_DataManager_makeSaveContents.call(this);
	contents.gameTime = $gameTime;
    contents.gameTint = $gameTint.makeSaveContents();
	return contents;
};

var Game_Time_DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
	Game_Time_DataManager_extractSaveContents.call(this, contents);
	if (contents.gameTime) {
        $gameTime = contents.gameTime;
    }
    if (contents.gameTint) {
        $gameTint.extractSaveContents(contents.gameTint);
    }
};
