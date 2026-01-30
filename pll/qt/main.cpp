#include <QCoreApplication>
#include "scrambles.h"
#include "files_processing.h"

const QString kOutputFileName = "Ab_Up";

void generateEmptyFiles()
{
    QStringList plls = {"Aa", "Ab", "E", "F", "Ga", "Gb", "Gc", "Gd", "H", "Ja", "Jb", "Na", "Nb", "Ra", "Rb", "T", "Ua", "Ub", "V", "Y", "Z"};
    QStringList aufs = {"noAuf", "U", "U2", "Up"};
    for (QString pll: plls)
    {
        for (QString auf: aufs)
        {
            QString command = "touch scrambles/" + pll + "_" + auf + ".txt";
            system(command.toLatin1().data());
        }
    }
}

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    auto files = txtFilesInSubDir("scrambles");
    for(QString& f: files)
    {
        Algs algs("scrambles/" + f);
        if (algs.size() != 0)
        {
            qDebug() << f + ": " + QString::number(algs.size()) + " noAuf algs loaded";
            algs.reduceNumberOfAlgs();
            qDebug() << f + ": reduced down to " + QString::number(algs.size());
            algs.writeToFile("normalized/" + f);
        }
    }

    qDebug() << "finished";

    return a.exec();
}


/*
x R' U R' D2 R U' R' D2 R2 x'
A a
x' R U' R D2 R' U R D2 R2 x
A b
R U' R U R U R U' R' U' R2
U b
R2 U R U R' U' R' U' R' U R'
U a
M2 U M2 U2 M2 U M2
H
R U R' U' R' F R2 U' R' U' R U R' F'
T
R' U L' U2 R U' R' U2 R L U'
J a
R U R' F' R U R' U' R' F R2 U' R' U'
J b
F R U' R' U' R U R' F' R U R' U' R' F R F'
Y
R' U2 R U2 R' F R U R' U' R' F' R2 U'
R b
L U2' L' U2' L F' L' U' L U L F L2' U
R a
R' U R' d' R' F' R2 U' R' U R' F R F
V
R' U2 R' d' R' F' R2 U' R' U R' F R U' F
F
R U R' y' R2 u' R U' R' U R' u R2
G d
R' U' R y R2 u R' U R U' R u' R2
G b
R2 u' R U' R U R' u R2 y R U' R'
G c
R2 u R' U R' U' R u' R2 y' R' U R
G a
M2 U M2 U M' U2 M2 U2 M' U2
Z
x' R U' R' D R U R' D' R U R' D R U' R' D'
E
R' U L' U2 R U' L R' U L' U2 R U' L U'
N b
L U' R U2 L' U R' L U' R U2 L' U R' U
N a
*/
