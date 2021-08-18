import './App.css';
import React, {Component} from "react";
import BarcodeReader from 'react-barcode-reader';
import moment from "moment";

class MainComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      infCell: null,
      action: null, // 1- нажали кнопку "положить" 0- нажали кнопку "очистить"
      cell: {
        idCell: 5
      },
      idOrder: 100,
      phoneNumber: "380999598699",
      idPharmacy: "4",
      openDialogWrongCell: false,
      openDialogScanCell: false,
      openDialogCleanCell: false,
      openDialogSealCell: false,
      pin: 'error',
      server: process.env.REACT_APP_SERVER_PATH,
      openDialogError: false,
      textError: null
    };
    this.getInfCell = this.getInfCell.bind(this);
    this.handleScan = this.handleScan.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.sendPinToCustomer = this.sendPinToCustomer.bind(this);
    this.syncInf = this.syncInf.bind(this);
  }

  async getInfCell() { //получение инф. про ячейки из  бд 911
    let targetUrl = `${process.env.REACT_APP_API_PATH}/api/cell`;
    const requestOption = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        server: this.state.server,
      }),
    }
    console.log('запрос статусов ячеек', requestOption)
    const response = await fetch(targetUrl, requestOption)
    const data = await response.json()
    console.log('ответ статусов', data)
    let list = data[0].slice()
    list.sort( (a, b) => {
      if (a.idCell > b.idCell) return 1
      if (a.idCell < b.idCell) return -1
      return 0
    } )
    return list
  }

  async handleClick(action, cell) {
    await this.setState({
      action: action,
      cell: cell,
      openDialogScanCell: true,
    });

  }

  async getPassword(idCell) { // вернет пароль и изменить статус на seal=true, то есть "ячейка занята"
    let targetUrl = `${process.env.REACT_APP_POST_PATH}/cells/${idCell}/seal`;
    const requestOption = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`,
      },
    };
    const response = await fetch(targetUrl, requestOption)
    const data = await response.json();
    console.log(data);

    if (data.pin === undefined) {
      await this.setState({
        openDialogError: true,
        openDialogWrongCell: false,
        openDialogScanCell: false,
        openDialogCleanCell: false,
        openDialogSealCell: false,
        textError: data.error,
        action: null,
      });
      return undefined;
    } else {
      await this.setState({
        pin: data.pin,
      });
      return (data.pin);
    }
  }

  async CleanCell(idCell) { // для того что б очистить ячейку нужно вызвать api для открытия и тогда изменится  статус на seal=false то есть "ячейка не занята"
    let targetUrl = `${process.env.REACT_APP_POST_PATH}/cells/${idCell}/open`;
    const requestOption = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`,
      },
    };
    const response = await fetch(targetUrl, requestOption)
    const data = await response.json();
    return (data.seal);
  }


  async sendPinToCustomer(pin) { // отправляет смс клиенту с паролем от ячейки (желательно текс исправить)
    let targetUrl = `${process.env.REACT_APP_API_PATH}/api/sms/customer`;
    console.log(pin, "sendPinToCustomer")
    const requestOption = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        text: `Номер заказа ${this.state.idOrder}. Пароль от ячейки ${pin}`,
        phone: this.state.phoneNumber,
      }),
    };
    // TODO не забыть расскоментить
    await fetch(targetUrl, requestOption)

  }

  async handleScan(data) {
    const cell = this.state.cell;
    if (data === cell.barcodeCell) {
      if (this.state.action === 1) { // товар хотят положить
        let pin = await this.getPassword(cell.idCell);// получаем пароль ячейки
        if (pin !== undefined) {
          await this.setState({
            openDialogSealCell: true,
            openDialogScanCell: false,
            openDialogWrongCell: false,
          });
          let targetUrl = `${process.env.REACT_APP_API_PATH}/api/log`;
          const requestOption = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              status: 1,
              idOrder: this.state.idOrder,
              idParcelMachine: cell.idParcelMachine,
              idCell: cell.idCell,
              numberClient: this.state.phoneNumber,
              pin: pin,
              idPharmacy: this.state.idPharmacy,
              server: this.state.server,
            }),
          };

          await fetch(targetUrl, requestOption);
          await this.sendPinToCustomer(pin);
          await this.setState({
            infCell: await this.getInfCell() // что бы отобразить уже измененную инф по ячейкам
          });
        }
      } else if (this.state.action === 0) {// ячейку хотят очистить
        let targetUrl = `${process.env.REACT_APP_API_PATH}/api/log`;
        let seal = await this.CleanCell(cell.idCell);
        const requestOption = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            status: 0,
            idParcelMachine: cell.idParcelMachine,
            idCell: cell.idCell,
            idPharmacy: this.state.idPharmacy,
            server: this.state.server,
          }),
        };
        if (!seal) {
          try {
            const response = await fetch(targetUrl, requestOption);
            const data = await response.json();
            console.log(data);
            await this.setState({
              openDialogCleanCell: true,
              openDialogWrongCell: false,
              infCell: await this.getInfCell()
            });
          } catch (e) {
            console.log(e);

          }
        }
      }
    } else { // не ячейку отсканировал провизор
      await this.setState({
        openDialogWrongCell: true,
        openDialogScanCell: false
      });
    }
  }

  handleError(err) {
    console.error(err)
  }

  async syncInf() { // синхонизация инф бд 911 и инф с почтомата
    const tempInfCell = await this.getInfCell();
    const url = `${process.env.REACT_APP_POST_PATH}/cells`;
    const requestOption = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`
      },
    }
    const response = await fetch(url, requestOption)
    const data = await response.json();
    console.log(tempInfCell);
    console.log(data);
    for (const ourCell of tempInfCell) {
      if (ourCell.status !== data[ourCell.idCell-1].seal && ourCell.status === true) {
        let targetUrl = `${process.env.REACT_APP_API_PATH}/api/log`;
        const requestOption = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            status: 0,
            idParcelMachine: ourCell.idParcelMachine,
            idCell: ourCell.idCell,
            idPharmacy: this.state.idPharmacy,
            server: this.state.server,
          }),
        };
        try {
          const response = await fetch(targetUrl, requestOption);
          const data = await response.json();
          console.log(data);

        } catch (err) {
          console.log(err);
        }

      }
    }
  }
  async componentDidMount() {
    await this.syncInf()
    const partURL = this.props.location.search.split('&');
    console.log(partURL)
    if(partURL){
      let idOrder = partURL[0].split('=')[1];
      let phoneNumber = partURL[1].split('=')[1];
      let idPharmacy = partURL[2].split('=')[1];
      let server = partURL[3].split('=')[1];
      await this.setState({
        idPharmacy: idPharmacy,
        phoneNumber: phoneNumber,
        idOrder: idOrder,
        server: server
      });
    }
    await console.log(this.state);


    const tempInfCell = await this.getInfCell();
    /** Это часть кода сортитует по почтоматам */
    // это если будет несколько почтоматов можно будет создать массив массивов в ячейках
    // которого будет инф по ячейкам определенного почтомата
    // let infCell = [[]];
    // tempInfCell.forEach(item => {
    //         if (infCell[item.idParcelMachine] === undefined)
    //             infCell[item.idParcelMachine] = []
    //         infCell[item.idParcelMachine].push(item)
    //     }
    // );
    await this.setState({
      // infCell: infCell,
      infCell: tempInfCell,
    });
    console.log(this.state.infCell)
  }

  closeDialog = function (dialog) {
    this.setState({
      [dialog]: false,
    });
  }

  render() {
    const {infCell} = this.state;
    let i = false;
    if (i) {
      return (<button onClick={this.getPassword}> очистить </button>)
    } else {
      return (
        <div>
          <div className="backBlock">
            <header className="App-header">
              <BarcodeReader
                onError={this.handleError}
                onScan={this.handleScan}
              />
              <table>
                <tbody>
                <tr>
                  <th>№ почтамата</th>
                  <th>№ ячейки</th>
                  <th>Статус</th>
                  <th>№ заказа</th>
                  <th>Дата и время</th>
                  <th>Действие</th>
                </tr>

                {infCell && infCell.map((item, key) => (
                  <tr style={{backcolor: "red"}} key={key}>
                    <td style={!item.status ? {background: "#99FF99"} : {background: "#CC3333"}}>{item.idParcelMachine}</td>
                    <td style={!item.status ? {background: "#99FF99"} : {background: "#CC3333"}}>{item.idCell}</td>
                    {
                      !item.status
                      ?
                      <td style={{background: "#99FF99"}}> Свободно</td>
                      :
                      <td style={{background: "#CC3333"}}>Занято</td>
                    }
                    {
                      !item.status
                      ?
                      <td style={{background: "#99FF99"}}> - </td>
                      :
                      <td style={{background: "#CC3333"}}>{item.idOrder} </td>
                    }
                    {
                      !item.status
                      ?
                      <td style={{background: "#99FF99"}}> - </td>
                      :
                      <td style={{background: "#CC3333"}}>{moment(item.datatime).format("DD.MM.YYYY, HH:mm:ss")}</td>
                    }
                    <td style={!item.status ? {background: "#99FF99"} : {background: "#CC3333"}}>
                      {
                        !item.status
                        ?
                        <button id="myModal" className='nice_button' onClick={() => this.handleClick(1, item)}> положить </button>
                        :
                        <button onClick={() => this.handleClick(0, item)}> очистить </button>
                      }
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>

            </header>
          </div>

          <div style={{display: this.state.openDialogWrongCell ? 'flex' : 'none'}} className="wrapper">
            <div className="block">
              <div className="modal-header">
                <span onClick={() => {
                  this.closeDialog("openDialogWrongCell")
                }} className="close">&times;</span>
                <h3>Вы не правильно отсканировали ячейку</h3>
              </div>
              <div className="modal-body">
                <p>Была отсканирована не верная ячейка. Остканируйте ячейку №{this.state.cell.idCell + 1} </p>
              </div>
            </div>
          </div>

          <div style={{display: this.state.openDialogScanCell ? 'flex' : 'none'}} className="wrapper">
            <div className="block">
              <div className="modal-header">
                <span onClick={() => {
                  this.closeDialog("openDialogScanCell")
                }} className="close">&times;</span>
                <h2>Сканироване ячейки</h2>
              </div>
              <div className="modal-body">
                <p>Отсканируйте ячейку №{this.state.cell.idCell}</p>
              </div>
            </div>
          </div>

          <div style={{display: this.state.openDialogSealCell ? 'flex' : 'none'}} className="wrapper">
            <div className="block">
              <div className="modal-header">
                <span onClick={() => {
                  this.closeDialog("openDialogSealCell")
                }} className="close">&times;</span>
                <h2>Положите заказ в ячейку.</h2>
              </div>
              <div className="modal-body">
                <p> Ячейка отсканирована правильно.</p>
                <p> Положите заказ №{this.state.idOrder} в ячейку №{this.state.cell.idCell + 1}. </p>
                <p> Покупателю было отправлено sms с кодом от ячейки.</p>
                <p> Для открытия ячейку нужно ввести *{this.state.pin} </p>
              </div>
            </div>
          </div>

          <div style={{display: this.state.openDialogCleanCell ? 'flex' : 'none'}} className="wrapper">
            <div className="block">
              <div className="modal-header">
                <span onClick={() => {
                  this.closeDialog("openDialogCleanCell")
                }} className="close">&times;</span>
                <h2>Можете забрать заказ</h2>
              </div>
              <div className="modal-body">
                <p>Ячейка очищена. Можете забрать заказ.</p>
              </div>
            </div>
          </div>

          <div style={{display: this.state.openDialogError ? 'flex' : 'none'}} className="wrapper">
            <div className="block">
              <div className="modal-header">
                <span onClick={() => {
                  this.closeDialog("openDialogError")
                }} className="close">&times;</span>
                <h2>Ошибка</h2>
              </div>
              <div className="modal-body">
                <p>Пароль от ячейки не был получен. Попробуйте другую ячейку.</p>
                <p>Ошибка: {this.state.textError} </p>
              </div>
            </div>
          </div>

        </div>
      );
    }
  }
}

export default MainComponent;