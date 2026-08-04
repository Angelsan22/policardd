FROM php:8.3-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
        unzip git libzip-dev libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader \
    && mkdir -p database && touch database/database.sqlite \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD ["sh", "-c", "php artisan migrate --force; php artisan serve --host=0.0.0.0 --port=8000"]
