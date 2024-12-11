#!/bin/bash

sed 's/^//' <<SHAR_EOF > .git/info/exclude
# git ls-files --others --exclude-from=.git/info/exclude
# Lines that start with '#' are comments.
# For a project mostly in C, the following would be a good set of
# exclude patterns (uncomment them if you want to use them):
*.swp
*~
.DS_Store
._*
*.log
*.dvi
*.ps
*.blg
*.toc
*.bbl
*.lof
*.lot
*.out
*.rtf
*.bak
*.aux
SHAR_EOF

git pull
find . -type f -name ._\* -exec rm -f {} \;
git add .
git ls-files --others --exclude-from=.git/info/exclude
TIME=`date`
git commit -am "last updates done at $TIME"
git push
