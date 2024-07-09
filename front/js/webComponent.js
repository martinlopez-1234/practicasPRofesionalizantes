class GestionCuentas extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                button {
                    margin: 5px;
                }
            </style>
            <h1>Gestión de cuentas</h1>
            <div>
                <button id="listar">Listar</button>
                <button id="crear">Crear</button>
                <button id="editar">Editar</button>
                <button id="borrar">Eliminar</button>
            </div>
            <h2>Listado de usuarios</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Saldo</th>
                    </tr>
                </thead>
                <tbody id="user-list">
                    <!-- Aca agrego las filas que voy crear dinámicamente -->
                </tbody>
            </table>
        `;
        this.listButton = this.shadowRoot.getElementById('listar');
        this.createButton = this.shadowRoot.getElementById('crear');
        this.editButton = this.shadowRoot.getElementById('editar');
        this.deleteButton = this.shadowRoot.getElementById('borrar');
        this.userList = this.shadowRoot.getElementById('user-list');

        this.listButton.addEventListener('click', () => this.listarCuentas());
        this.createButton.addEventListener('click', () => this.crearCuenta());
        this.editButton.addEventListener('click', () => this.editarCuenta());
        this.deleteButton.addEventListener('click', () => this.borrarCuenta());
    }

    async recuperarCuentasJson() {
        try {
            const respuesta = await fetch('./js/cuentas.json');
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            const data = await respuesta.json();
            return data.cuentas;
        } catch (error) {
            console.error("Error al recuperar el archivo JSON:", error);
        }
    }

    async listarCuentas() {
        const cuentas = await this.recuperarCuentasJson();
        if (!cuentas) return;

        this.userList.innerHTML = '';

        cuentas.forEach(cuenta => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${cuenta.id}</td>
                <td>${cuenta.username}</td>
                <td>${cuenta.saldo}</td>
            `;
            this.userList.appendChild(fila);
        });
    }

    crearCuenta() {
        // Lógica para crear una cuenta
        const newId = prompt("Ingrese el ID:");
        const newUsername = prompt("Ingrese el nombre de usuario:");
        const newSaldo = prompt("Ingrese el saldo:");

        if (newId && newUsername && newSaldo) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${newId}</td>
                <td>${newUsername}</td>
                <td>${newSaldo}</td>
            `;
            this.userList.appendChild(newRow);
        }
    }

    editarCuenta() {
        // Lógica para editar una cuenta
        const userId = prompt("Ingrese el ID de la cuenta a editar:");
        const row = Array.from(this.userList.children).find(row => row.children[0].textContent === userId);

        if (row) {
            const newUsername = prompt("Ingrese el nuevo nombre de usuario:", row.children[1].textContent);
            const newSaldo = prompt("Ingrese el nuevo saldo:", row.children[2].textContent);

            if (newUsername) row.children[1].textContent = newUsername;
            if (newSaldo) row.children[2].textContent = newSaldo;
        } else {
            alert("Cuenta no encontrada.");
        }
    }

    borrarCuenta() {
        // Lógica para borrar una cuenta
        const userId = prompt("Ingrese el ID de la cuenta a eliminar:");
        const row = Array.from(this.userList.children).find(row => row.children[0].textContent === userId);

        if (row) {
            this.userList.removeChild(row);
        } else {
            alert("Cuenta no encontrada.");
        }
    }
}

window.customElements.define("gestion-cuentas", GestionCuentas);
