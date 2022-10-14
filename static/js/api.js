const BASEURL = 'http://localhost:5000/api'
const ul = $('#ul-list');

function processCupcakes(cupcake) {
    const parent = ul.append(`<li>Cupcake ${cupcake.id}</li>`);
    const child = parent.append('<ul>');
    child.append(`<li>Flavor: ${cupcake.flavor}</li>
    <li>Size: ${cupcake.size}</li>
    <li>Rating: ${cupcake.rating}</li>
    <li><img src="${cupcake.image}" width="200" height="200" size="200" alt="no cupcake image for you!">`);
    child.append('<br>');
}

function loopCupcakes(resp) {
    for (let cupcake of resp.data.cupcakes) {
        processCupcakes(cupcake)
    }
    console.log(resp);
}

async function getCupcakes() {
    const resp = await axios.get(`${BASEURL}` + '/cupcakes');
    loopCupcakes(resp);
}

async function addCupcake(e) {
    e.preventDefault();
    const flavor = $('#flavor').val();
    const size =  $('#size').val();
    const rating = $('#rating').val();
    const image = $('#image').val();
    const resp = await axios.post(`${BASEURL}` + '/cupcakes', {flavor, size, rating, image});
    const cupcake = resp.data.cupcake;
    processCupcakes(cupcake);

}

function handleFilterForm() {
    if ($('#rating-select').length > 0) {
        $('#rating-select').remove();
    }
    if ($('#input-field').length > 0 ) {
        $('#input-field').remove();
    }
    if ($('#form-submit-button').length > 0) {
        $('#form-submit-button').hide();
    }

    if ($(this).val() === 'rating') {
       const select = $('#filter-form').append('<select id="rating-select" name="rating-type">'
       +'<option value="">--Please choose an option--</option>'
       +'<option value="gt">Greater than</option>'
       +'<option value="lt">Less than</option>'
       +'<option value="eq">Equal to</option></select>&nbsp;');
       select.append('<input id="input-field" name="value-field" type=number min=1 max=30>&nbsp;');
    } else {
        $('#filter-form').append('<input id="input-field" type="text" name="value-field">&nbsp;');
    }
    $('#form-submit-button').show();
}

async function makeFilterRequest(e) {
    e.preventDefault();

    const mode = $('#cupcake-filter').val();
    const value = $('#input-field').val();
    let resp = '';
    if (mode === 'rating') {
        const type = $('#rating-select').val();
        resp = await axios.post(`${BASEURL}` + '/cupcakes/filter', {mode, type, value});
    } else {
        resp = await axios.post(`${BASEURL}` + '/cupcakes/filter', {mode, value});
    }
    $('#ul-list').children().remove();
    loopCupcakes(resp);

}

$('#cupcake_form').on('click', addCupcake);

$('#cupcake-filter').on('change', handleFilterForm);

$('#form-submit-button').on('click', makeFilterRequest);

getCupcakes();