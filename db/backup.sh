#!/bin/bash

DATE=$(date +"%Y%m%d")

BACKUP_DIR="/backup/mysql"

MYSQL_USER="root"
MYSQL_PASSWORD="ArchLinuxBOG69*"

MYSQL=/usr/bin/mysql
MYSQLDUMP=/usr/bin/mysqldump

SKIPDATABASES="Database|information_schema|performance_schema|mysql"

RETENTION=14

mkdir -p $BACKUP_DIR/$DATE

databases=`$MYSQL -u$MYSQL_USER -p$MYSQL_PASSWORD -e "SHOW DATABASES;" | grep -Ev "($SKIPDATABASES)"`

for db in $databases; do
echo $db
$MYSQLDUMP --force --opt --user=$MYSQL_USER -p$MYSQL_PASSWORD --skip-lock-tables --events --databases
$db | gzip > "$BACKUP_DIR/$DATE/$db.sql.gz"
done

find $BACKUP_DIR/* -mtime +$RETENTION -delete