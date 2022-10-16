class FilterFormMadness {
    constructor(cupcakeMadness) {
        this.cupcakeMadness = cupcakeMadness;
        this.BASEURL = 'http://localhost:5000/api';
    }

    handleFilterForm() {
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

    async makeFilterRequest(e) {
        e.preventDefault();
    
        const mode = $('#cupcake-filter').val();
        const value = $('#input-field').val();
        let resp = '';
        if (mode === 'rating') {
            const type = $('#rating-select').val();
            //console.log(this.BASEURL);
            //console.log(`${this.BASEURL}`);
            resp = await axios.post('http://localhost:5000/api' + '/cupcakes/filter', {mode, type, value});
        } else {
            resp = await axios.post('http://localhost:5000/api' + '/cupcakes/filter', {mode, value});
        }
        $('#ul-list').children().remove();
        this.cupcakeMadness.loopCupcakes(resp);
    }
}

class CupcakeMadness {
    constructor() {
        this.ul = $('#ul-list');
        this.BASEURL = 'http://localhost:5000/api'
    }

    async getCupcakes() {
        const resp = await axios.get(`${this.BASEURL}` + '/cupcakes');
        this.loopCupcakes(resp);        
    }

    loopCupcakes(resp) {
        for (let cupcake of resp.data.cupcakes) {
            this.processCupcakes(cupcake)
        }
        console.log(resp);
    }

    processCupcakes(cupcake) {
        const parent = this.ul.append(`<li>Cupcake ${cupcake.id}</li>`);
        const child = parent.append('<ul>');
        child.append(`<li>Flavor: ${cupcake.flavor}</li>
        <li>Size: ${cupcake.size}</li>
        <li>Rating: ${cupcake.rating}</li>
        <li><img src="${cupcake.image}" width="200" height="200" size="200" alt="no cupcake image for you!">`);
        child.append('<br>');
    }

    async addCupcake(e) {
        e.preventDefault();
        const flavor = $('#flavor').val();
        const size =  $('#size').val();
        const rating = $('#rating').val();
        const image = $('#image').val();
        const resp = await axios.post(`${this.BASEURL}` + '/cupcakes', {flavor, size, rating, image});
        const cupcake = resp.data.cupcake;
        this.processCupcakes(cupcake);
    }
}

cupcakeMadness = new CupcakeMadness();
filterFormMadness = new FilterFormMadness(cupcakeMadness);

cupcakeMadness.getCupcakes();

$('#cupcake_form').on('click', cupcakeMadness.addCupcake);
$('#cupcake-filter').on('change', filterFormMadness.handleFilterForm);
$('#form-submit-button').on('click', filterFormMadness.makeFilterRequest);