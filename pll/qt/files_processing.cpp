#include "files_processing.h"

QStringList txtFilesInSubDir(QString subdir)
{
    QDir export_folder(subdir);
    export_folder.setNameFilters(QStringList()<<"*.txt");
    return export_folder.entryList();
}
