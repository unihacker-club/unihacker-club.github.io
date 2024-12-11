while read NAME
do
    echo "<div class=\"team-member\">"
    echo "    <div class=\"circle-double-bordered\">"
    echo "        <img src=\"cdn/img/team/no_img.jpg\" alt=\"$NOME\">"
    echo "    </div>"
    echo "    <p>$NOME<br>Colaborador</p>"
    echo "</div>"
done < "$1"

