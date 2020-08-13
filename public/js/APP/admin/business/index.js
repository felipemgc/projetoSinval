
$(function () {
    $('.mask-date2').mask('00/0000', { clearIfNotMatch: true });

    $(".btn-filter-business").on("click", function () {

        $(".containers-results").fadeOut(500);
        $(".containers-results").find(".results-container").remove();
        $(".canvas-container").fadeOut(500);
        $("#myChart").remove();
        $("#myChartUser").remove();
        $("#myChartCliente").remove();
        var formEle = $('#form-business');
        var postData = {};

        var formdata = new FormData($("#form-business")[0]);

        postData.email = $(formEle).find('input[name=email]').val();
        postData.cliente = $(formEle).find('select[name=cliente]').val();
        postData.periodo = $(formEle).find('input[name=periodo]').val();
        postData.descricao = $(formEle).find('input[name=descricao]').val();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });

        $.ajax({
            type: 'POST',
            data: formdata,
            url: getUrl() + "/business/data/getResultheader",
            processData: false,
            contentType: false,

            success: function (resp) {
                for (var prop in resp.header) {
                    $(".containers-results").append("<div class='results-container'><h4>" + prop.replace("_", " ") + "</h4><p>" + resp.header[prop] + "</p></div>")
                    $(".containers-results").fadeIn(500)

                }
                console.log(resp)
                if (resp.consulta) {
                    $(".canvas-container").append("<canvas id='myChart' width='400' height='130'></canvas>");
                }
                if (resp.consultaUser) {
                    $(".canvas-container").append("<canvas id='myChartUser' width='400' height='130'  style='margin-top: 2em;'></canvas>");
                }
                if (resp.consultaCliente) {
                    $(".canvas-container").append("<canvas id='myChartCliente' width='400' height='130'  style='margin-top: 2em; margin-bottom: 3em;'></canvas>");
                }
                $(".canvas-container").fadeIn(500)

                var label = [];
                var options = [];
                var emails = [];
                var labelUser = [];
                var labelCliente = [];
                for (var prop in resp.consulta) {
                    label.push(resp.consulta[prop].cliente);
                }

                label = label.filter(arrayUnic);
                for (var prop in resp.consulta) {
                    var data = [];

                    if (emails.indexOf(resp.consulta[prop].email) >= 0) {
                        for (var index in options) {
                            if (options[index].label == resp.consulta[prop].email) {
                                options[index].data.push(resp.consulta[prop].quantidade);
                            }
                        }
                    } else {
                        emails.push(resp.consulta[prop].email);
                        data = [resp.consulta[prop].quantidade]
                        var value = {
                            label: resp.consulta[prop].email,
                            backgroundColor: ["#3cba9f", "#8e5ea2", "#e8c3b9", "#e8c3b9", "#c45850"],
                            data: data
                        }

                        options.push(value)
                    }

                }


                if (resp.consulta) {
                    var ctx = document.getElementById('myChart').getContext('2d');

                }
                if (resp.consultaCliente) {
                    var ctxCliente = document.getElementById('myChartCliente').getContext('2d');
                }
                if (resp.consultaUser) {
                    var ctxUser = document.getElementById('myChartUser').getContext('2d');
                }


                $(".canvas-container").fadeIn(500)

                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: label,
                        backgroundColor: ["#3cba9f", "#8e5ea2", "#e8c3b9", "#e8c3b9", "#c45850"],
                        datasets: options
                    },

                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });

                var dataCliente = [];

                for (var prop in resp.consultaCliente) {
                    labelCliente.push(resp.consultaCliente[prop].cliente);
                    dataCliente.push(resp.consultaCliente[prop].quantidade)
                }


                var myChartCliente = new Chart(ctxCliente, {
                    type: 'doughnut',
                    data: {
                        labels: labelCliente,
                        datasets: [
                            {
                                label: "Population (millions)",
                                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                                data: dataCliente
                            }
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Quantidade de lançamentos por clientes. '
                        }
                    }
                });



                var dataUser = [];

                for (var prop in resp.consultaUser) {
                    labelUser.push(resp.consultaUser[prop].email);
                    dataUser.push(resp.consultaUser[prop].quantidade)
                }


                var myChartUser = new Chart(ctxUser, {
                    type: 'doughnut',
                    data: {
                        labels: labelUser,
                        datasets: [
                            {
                                label: "Population (millions)",
                                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                                data: dataUser
                            }
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Quantidade de lançamentos por usuários. '
                        }
                    }
                });


            },
            error: function (jqXHR) {
            }
        });
    });

});

function arrayUnic(value, index, self) {
    return self.indexOf(value) === index;
}

function verifica(array, item) {
    if (array.indexOf(item) > -1) {
        return true;
    } else {
        return false;
    }
}