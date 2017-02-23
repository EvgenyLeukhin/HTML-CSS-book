<?
echo "<hr> <h2>Выполнена обработка формы</h2>";
print_r($_POST);
echo "<hr>";

// Имя:
echo "<b>1. Ваше имя: </b>";
echo("<i>".$_POST["first-name"]."</i><br>");

// Фамилия:
echo "<b>2. Ваша фамилия: </b>";
echo("<i>".$_POST["sername"]."</i><br>");

// E-mail:
echo "<b>3. Ваш e-mail: </b>";
echo("<i>".$_POST["email"]."</i><br>");

// Дата:
echo "<b>4. Дата заполнения: </b>";
echo("<i>".$_POST["date"]."</i><br>");


// Обработка формы
if ($_POST["first-name"] == "") {
	echo "<span style=\"color: red;\">Вы не ввели своё <b>имя</b>! </span><br>";
}
if ($_POST["sername"] == "") {
	echo "<span style=\"color: red;\">Вы не ввели свою <b>фамилию</b>! </span><br>";
}
if ($_POST["email"] == "") {
	echo "<span style=\"color: red;\">Вы не ввели ваш <b>email</b>! </span><br>";
}
if ($_POST["date"] == "") {
	echo "<span style=\"color: red;\">Вы не ввели <b>дату заполнения</b>!</span> <br>";
}
if (($_POST["first-name"] == true) &&
		($_POST["sername"]    == true) &&
		($_POST["email"]      == true) &&
		($_POST["sername"]    == true) &&
		($_POST["date"]       == true)) {
	echo "<span style=\"color: green; font-size: 2em;\"><b>Вы полностью заполнили форму!</b></span>";
}

?>
