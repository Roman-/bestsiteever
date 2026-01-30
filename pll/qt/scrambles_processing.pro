QT += core
QT -= gui

CONFIG += c++11

TARGET = scrambles_processing
CONFIG += console
CONFIG -= app_bundle

TEMPLATE = app

SOURCES += main.cpp \
    scrambles.cpp \
    files_processing.cpp

HEADERS += \
    scrambles.h \
    files_processing.h
