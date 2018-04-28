function displayTime() {
    moment().locale('fr')
    let time = moment().format('LTS')
    $('#clock').html(time)
    setTimeout(displayTime, 1000)
}

$(document).ready(function() {
    displayTime()
})
