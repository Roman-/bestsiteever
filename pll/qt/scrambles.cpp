#include "scrambles.h"

int levenshtein_distance(const QString &s1, const QString &s2)
{
    // To change the type this function manipulates and returns, change
    // the return type and the types of the two variables below.
    int s1len = s1.size();
    int s2len = s2.size();

    auto column_start = (decltype(s1len))1;

    auto column = new decltype(s1len)[s1len + 1];
    std::iota(column + column_start, column + s1len + 1, column_start);

    for (auto x = column_start; x <= s2len; x++) {
        column[0] = x;
        auto last_diagonal = x - column_start;
        for (auto y = column_start; y <= s1len; y++) {
            auto old_diagonal = column[y];
            auto possibilities = {
                column[y] + 1,
                column[y - 1] + 1,
                last_diagonal + (s1[y - 1] == s2[x - 1]? 0 : 1)
            };
            column[y] = std::min(possibilities);
            last_diagonal = old_diagonal;
        }
    }
    auto result = column[s1len];
    delete[] column;
    return result;
}


void removeMiscChars(QString& s)
{
    QString miscChars = "\".,";
    for (QChar& ap: miscChars)
        s = s.replace(QString(1,ap), "\'");
    while (s.indexOf("  ") != -1)
        s.replace("  ", " ");
}

QString normalize(QString s)
{
    removeMiscChars(s);
    QString apostrophesChars = "ʼ᾿՚’`";
    for (QChar& ap: apostrophesChars)
        s = s.replace(QString(1,ap), "\'");

    while (s.indexOf("  ") != -1)
        s.replace("  ", " ");
    QStringList list = s.split(' ');

    QString result;
    for (const QString& m: list)
    {
        if (isCubeMove(m))
        {
            result += m + " ";
        }
    }

    return result.mid(0, result.length() - 1);
}

bool isCubeMove(const QString& m)
{
    return m.indexOf(QRegExp("^[RLFBDU][\'2]?$")) != -1;
}

QString inverseMove(const QString& move)
{
    Q_ASSERT(isCubeMove(move));
    if (move.length() == 1)
        return move + "\'"; // U -> U'
    if (move[1] == '2')
        return move; // U2 -> U2
    return move.mid(0, 1); // U' -> U
}

bool hasAufOrSetup(const QString& alg)
{
    if (alg.length() < 3)
        return false;
    return (alg[0] == 'U' || alg[alg.length() - 1] == 'U'  || alg[alg.length() - 2] == 'U');
}

bool surroundedWithDee(const QString& alg)
{
    if (alg.length() < 3)
        return false;
    return (alg[0] == 'D' && (alg[alg.length() - 1] == 'D'  || alg[alg.length() - 2] == 'D'));
}

Algs::Algs(const QString& filepath)
{
    // kMaxNumberOutputAlgs
    QFile file(filepath);
    if (!file.open(QIODevice::ReadOnly | QIODevice::Text))
        qDebug() << "cant open" << filepath;

    while (!file.atEnd()) {
        QByteArray line = file.readLine();
        QString alg = normalize(line);
        if (alg != "" && !hasAufOrSetup(alg) && !surroundedWithDee(alg))
            algs_ << alg;
    }

    file.close();

    if (algs_.size() == 0)
        qDebug() << ("\033[1;31m" + filepath + "\033[0m:" + " - NO algs found").toLatin1().data();
}

void Algs::reduceNumberOfAlgs()
{
    while (algs_.size() > kIrreducable)
        reduceRandomly();
    qDebug() << "end of randomized alg";
    while (algs_.size() > kMaxNumberOutputAlgs)
    {
        // find two most similar algs
        int minDist = levenshtein_distance(algs_[0], algs_[1]), minJ = 1;
        for (int i = 0; i < algs_.size() - 1; ++i)
        {
            for (int j = i+1; j < algs_.size(); ++j)
            {
                int dist = levenshtein_distance(truncated(algs_[i]), truncated(algs_[j]));
                if (dist < minDist)
                {
                    minDist = dist;
                    minJ = j;
                }
            }
        }
        algs_.removeAt(minJ);
    }
}

void Algs::writeToFile(const QString& filepath)
{
    QFile file0(filepath);
    if (!file0.open(QIODevice::WriteOnly | QIODevice::Text))
         qDebug() << "cant open" << filepath;
    QTextStream out(&file0);

    for (QString& s: algs_)
            out << "\t\t\t\"" << s << "\",\n";

    file0.close();
}

int Algs::size() const
{
    return algs_.size();
}

// returns substring of s from 0 to some
QString truncated(const QString& s)
{
    return s.mid(0, s.length() * 0.7);
}

void Algs::reduceRandomly()
{
    int kSampleSize = 15,
            kDontReduce = 20; // don't remove first 20 scrambles because they're short and good
    Q_ASSERT(algs_.size() > kSampleSize * 2 + kDontReduce);
    int startPos = kDontReduce + qrand() % (algs_.size() - kDontReduce - kSampleSize - 2),
            endPos = startPos + kSampleSize;
    int minDist = levenshtein_distance(truncated(algs_[startPos]), truncated(algs_[startPos+1])), minJ = startPos+1;
    for (int i = startPos; i < endPos; ++i)
    {
        for (int j = i+1; j < endPos; ++j)
        {
            int dist = levenshtein_distance(algs_[i], algs_[j]);
            if (dist < minDist)
            {
                minDist = dist;
                minJ = j;
            }
        }
    }
    algs_.removeAt(minJ);
}
