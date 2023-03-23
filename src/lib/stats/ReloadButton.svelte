<script>
    import "@sweetalert2/theme-dark/dark.min.css"
    import Swal from 'sweetalert2'

    function ask() {
        Swal.fire({
            title: "Are you sure?",
            text: "",
            html: `
                If you do this multiple times, it can be very annoying!
                <input id="username" class="swal2-input" type="text" placeholder="Username">
                <input id="password" class="swal2-input" type="password" placeholder="Password">`,
            icon: "warning",

            showConfirmButton: true,
            confirmButtonText: "DO IT!",
            confirmButtonColor: "#e64942",

            showCancelButton: true,
            cancelButtonText: "ok fine i won't",

            reverseButtons: true,

            preConfirm: () => {
                const login = Swal.getPopup().querySelector('#username').value
                const password = Swal.getPopup().querySelector('#password').value
                if (!login || !password) {
                    Swal.showValidationMessage(`Please enter login and password`)
                }
                return { login: login, password: password }
            }

        })
            .then(result => {
                if(!result) throw null;
                if(!result.value) throw null;

                let p = result.value.password;

                return fetch("https://api.redclock.fun/reload", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({key: p})
                })

                /*return $.ajax({
                    method: "POST",
                    url: "https://api.redclock.fun/reload",
                    data: {key: p}
                });*/
            })
            .then(async (d) => {
                let data = await d.json();
                console.log("[RELOAD] Recieved: %o", data);
                if(data.success) {
                    Swal.fire("Reloading!", "Everyone using the website and desktop app should reload within 30 seconds!", "success")
                } else {
                    if(data.error) {
                        Swal.fire("Something went wrong!", "Error: "+data.message+"", "error")
                    } else {
                        Swal.fire("Something went wrong!", "But there is no error! Raw data: "+JSON.stringify(data), "error")
                    }
                }
            })
            .catch((e) => {
                if(!e) return;
                console.log("[RELOAD] response: ", e)
                Swal.fire("Something went wrong!", "A network error occurred.", "error")
            })
    }
    console.log(Swal)
</script>
<button class="btn btn-lg variant-filled-warning" data-sveltekit-reload on:click={ask}>Reload all pages</button>