// Phone number
const xphone = '+1-888-808-6969';

// Timer for the popup
const xtime = 120; // in seconds
const xpoptime = 15; // in seconds

const queries = new URLSearchParams(window.location.search)
const xquery = {
    page: queries.get('page'),
    airlines: queries.get('airlines'),
    cabin: queries.get('cabin')
}
const isOfferPage = xquery.page != null && xquery.airlines != null && xquery.cabin != null ? true : false

var ytime = xtime, xtimeout, xinterval;

if ( isOfferPage ) {
    if ( jQuery('select[name="airlines"]').find('option[value="' + xquery.airlines + '"]').length > 0)
        jQuery('select[name="airlines"]').val( xquery.airlines )

    if ( jQuery('select[name="cabinclass"]').find('option[value="' + xquery.cabin + '"]').length > 0)
        jQuery('select[name="cabinclass"]').val( xquery.cabin )
}
else
    jQuery('#main-page').show()

jQuery(document).ready(() => {
    // Update phone number everywhere
    jQuery('.phone-number').text( xphone )
    jQuery('.phone-number-link').attr( 'href', `tel:${xphone}` )

    // Active select 2 fields
    jQuery('.airlines-select').select2({
        width: '100%'
    })
    jQuery('.cabin-select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
    })
    jQuery('.airlines-select').on('select2:open', (e) => {
        setTimeout(() => {
            document.querySelector('.select2-search__field').focus();
        }, 50)
    });

    //close footer bar
    jQuery('.footer-close').on('click', (e) => {
        e.preventDefault()
        jQuery('.footer-number').fadeOut()
    })

    // Animate input fields
    jQuery(document).on('focus', '.field input', function () {
        let input = jQuery(this)
        let parent = input.parent()

        parent.addClass('focused')
    })
    jQuery(document).on('focusout', '.field input', function () {
        let input = jQuery(this)
        let parent = input.parent()

        if (input.val().trim().length !== 0)
            return false;

        parent.removeClass('focused')
    })

    // Main Page Form Submission
    jQuery('.flight-search').on('submit', function (e) {
        e.preventDefault()

        jQuery('#flightSearchModal, #collectLeadModal').modal('hide')

        ytime = xtime

        if (xtimeout) {
            clearTimeout(xtimeout)
            xtimeout = false
        }

        if (xinterval) {
            clearInterval(xinterval)
            xinterval = false
        }

        // Getting the select elements
        let airlines = jQuery(this).find('select[name="airlines"]')
        let cabinclass = jQuery(this).find('select[name="cabinclass"]')

        // Getting the user selections
        let values = {
            airlines: airlines.val(),
            cabinclass: cabinclass.val()
        }

        // Getting the visual text for the selections
        let labels = {
            airlines: airlines.find(':selected').text(),
            cabinclass: cabinclass.find(':selected').text()
        }

        jQuery('input.airlines-name').val(labels.airlines)
        jQuery('.airlines-name:not(input)').text(labels.airlines)

        jQuery('input.cabinclass-name').val(labels.cabinclass)
        jQuery('.cabinclass-name:not(input)').text(labels.cabinclass)

        jQuery('input.cabinclass-name-full').val(`${labels.cabinclass} Cabin Class`)
        jQuery('.cabinclass-name-full:not(input)').text(`${labels.cabinclass} Cabin Class`)

        // Showing the offer page
        jQuery('#main-page').hide()
        jQuery('#offer-page').show()

        // Changing the page title
        document.title = 'Offers'

        // Updating the url
        window.history.pushState('offer-page', '', `?page=offer&airlines=${values.airlines}&cabin=${values.cabinclass}`)

        if (!xtimeout) {
            xcalctimer();

            xtimeout = setTimeout(() => {
                jQuery('#collectLeadModal').modal('show')

                if (!xinterval)
                    xinterval = setInterval(xcalctimer, 1000)

                xtimeout = false;
            }, (xpoptime * 1000))
        }

        return
    })

    // Offer Page Form and Modal Form Interchange Data
    let leadFormPage = jQuery('form#lead-onpage'),
        leadFormModal = jQuery('#collectLeadModal')

    al_interchange(leadFormPage, leadFormModal)
    al_interchange(leadFormModal, leadFormPage)

    if (isOfferPage)
        jQuery('.flight-search').submit()
})

function al_interchange(firstform, secondform) {
    firstform
        .find('input[name="customer-name"]')
        .on('change', function () {
            let name = jQuery(this).val()
            secondform.find('input[name="customer-name"]').val(name).parent().addClass('focused')
        })
        .end()
        .find('input[name="customer-email"]')
        .on('change', function () {
            let email = jQuery(this).val()
            secondform.find('input[name="customer-email"]').val(email).parent().addClass('focused')
        })
        .end()
        .find('input[name="customer-phone"]')
        .on('change', function () {
            let phone = jQuery(this).val()
            secondform.find('input[name="customer-phone"]').val(phone).parent().addClass('focused')
        })
}

function xcalctimer() {
    let tmin = Math.floor(ytime / 60)
    let tsec = ytime - (tmin * 60)

    jQuery('.dyn-minutes').text(tmin < 10 ? '0' + tmin.toString() : tmin.toString())
    jQuery('.dyn-seconds').text(tsec < 10 ? '0' + tsec.toString() : tsec.toString())

    ytime--

    if (ytime < 0) {
        if (xinterval) {
            clearInterval(xinterval)
            xinterval = false
        }

        ytime = xtime;
        jQuery('#collectLeadModal').modal('hide')
    }

    return
}
