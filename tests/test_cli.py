from calculator.cli import main


def test_main_prints_result(capsys):
    assert main(["add", "2", "3"]) == 0
    assert capsys.readouterr().out.strip() == "5.0"


def test_main_reports_divide_by_zero(capsys):
    assert main(["div", "1", "0"]) == 1
    assert "cannot divide by zero" in capsys.readouterr().err
