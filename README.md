### Начало работы с проектом
Начало работы с проектом.
1. Склонировать репозиторий.
2. Создать папку data на одном уровне с папкой в которую был склонирован репозиторий. Эта папка будет подключаться как volume и в ней будет храниться БД проекта и БД redis.
3. В папке в которую был склонирован проект создать файл .env с содержанием .env.example и задать свои значения паролей итп для БД.
4. Запустить проект docker-compose up. Приложение будет доступно на порте 8585.
5. Эндпоинт /deals, то есть GET запрос http://localhost:8585/deals. 
6. POST запрос http://localhost:8585/deals с form-data параметром deals - обрабатываемым файлом.

### Формат csv файла
Определение разделителя на лету не реализовано, поэтому предполагается, что разделителем является запятая ','. Десятичная часть у чисел указывается через точку '.'.
