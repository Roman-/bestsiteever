#ifndef SCRAMBLES_H
#define SCRAMBLES_H

#include <QString>
#include <QStringList>
#include <QDebug>
#include <QTextStream>
#include <QDebug>
#include <QFile>

const int kMaxNumberOutputAlgs = 25;
const int kIrreducable = 80; // can't do O(n^3) alg with that amount of strings

// delete double spaces, leave moves only. "R  U' (2f)" -> "R U'"
QString normalize(QString s);

bool isCubeMove(const QString &m);
QString shorten(QString s);
QString inverseMove(const QString& move);

QString removeSetups(const QString& alg);

/// \returns true if alg starts or ends up with U layer move
bool hasAufOrSetup(const QString& alg);

/// \returns true if alg starts AND ends up with D layer move
/// Usually they're like 14f scrambles that are actually 12f but starts end ends up with D layer adjustment
bool surroundedWithDee(const QString& alg);

int levenshtein_distance(const QString &s1, const QString &s2);

class Algs
{
public:
    Algs(const QString& filepath);
    void reduceNumberOfAlgs();
    void writeToFile(const QString& filepath);
    int size() const;
private:
    QStringList algs_;
    void reduceRandomly(); // more fast version of Reduce. Removes one element
};

#endif // SCRAMBLES_H
