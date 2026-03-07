#!/bin/bash

USERNAME=$1
PASSWORD=$2
HOMEDIR=$3

# vytvoření usera s home directory
useradd -m -d $HOMEDIR $USERNAME

# nastavení hesla
echo "$USERNAME:$PASSWORD" | chpasswd

# vytvoření adresáře pokud neexistuje
mkdir -p $HOMEDIR

# správné vlastnictví
chown -R $USERNAME:$USERNAME $HOMEDIR

echo "SFTP user $USERNAME created with home $HOMEDIR"