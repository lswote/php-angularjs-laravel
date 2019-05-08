FROM php:7.1.2-apache
WORKDIR /app/lib
# Install dependencies
RUN apt-get update
RUN docker-php-ext-install mysqli
RUN docker-php-ext-install pdo_mysql
RUN apt-get install -y --no-install-recommends git zip
RUN apt-get install -y mysql-client

RUN curl --silent --show-error https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer
# Setup env and config
COPY .docker/*.conf ./
RUN cat httpd.dev.conf >> /etc/apache2/apache2.conf
RUN cp teamsrit.conf /etc/apache2/sites-available

# Add apache mods
RUN a2enmod rewrite
RUN a2ensite teamsrit

# Add code and install dependencies
WORKDIR /app
ADD . .
RUN /usr/local/bin/composer install --ignore-platform-reqs
RUN echo 'var env = "dev"' > ./angular/env.js

# Move files to apache
RUN mv angular /var/www/html/
RUN mv public /var/www/html/ 
RUN service apache2 restart
RUN cat /app/lib/hosts.conf >> /etc/hosts

CMD [".docker/db/app-setup.sh"]
