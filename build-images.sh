#!/usr/bin/env bash

VERSION='1.0.0'


docker build -t taskapp-backend:$VERSION -f backend/Dockerfile .
