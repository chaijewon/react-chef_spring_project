import React, {Component, Fragment} from 'react'
import axios from 'axios'
// axios => 요청값을 보내고 결과값을 받아오는 라이브러리
// 자바 스크립트 : 보내고 받는 경우 => Callback
/*
      public String App()
      {
          <div>
            <h1></h1>
          </div>
          ChefDetail()
      }
      public String ChefDetail()
      {
           <h3></h3>
      }
 */
class App extends Component{
  constructor(props) {
    super(props);
    this.state={
       chef:[],
       page:1,
       totalpage:0,
       recipe:[],
        isShow:0,
        fd:'',
        chef_name:''
    }
    this.chefFindData=this.chefFindData.bind(this)
      this.findChange=this.findChange.bind(this);
  }
  findChange(fd)
  {
      this.setState({fd:fd})
  }
  chefFindData()
  {
      axios({
          method:'POST',
          url:'http://localhost:8080/web/react_chef/chef_find.do',
          headers:{
              'Content-type':'application/x-www-form-urlencoding;charset=UTF-8'
          },
          params:{
              fd:this.state.fd,
              chef:this.state.chef_name
          }
      }).then((response)=>{
          console.log(response)
          this.setState({recipe:response.data})
          //this.state.chef=response.data
          // 데이터 갱신 => 브라우저 갱신된 데이터 출력 render()호출
      })
  }
  chefDetailData(chef)
  {
      axios({
          method:'POST',
          url:'http://localhost:8080/web/react_chef/chef_detail.do',
          headers:{
              'Content-type':'application/x-www-form-urlencoding;charset=UTF-8'
          },
          params:{
              chef:chef
          }
      }).then((response)=>{
          console.log(response)
          this.setState({isShow:1,recipe:response.data,chef_name:chef})
          //this.state.chef=response.data
          // 데이터 갱신 => 브라우저 갱신된 데이터 출력 render()호출
      })
  }
  post()
  {
    axios({
      method:'POST',
      url:'http://localhost:8080/web/react_chef/chef_list.do',
      headers:{
        'Content-type':'application/x-www-form-urlencoding;charset=UTF-8'
      },
      params:{
        page:this.state.page
      }
    }).then((response)=>{
      console.log(response)
      this.setState({chef:response.data})
      //this.state.chef=response.data
      // 데이터 갱신 => 브라우저 갱신된 데이터 출력 render()호출
    })
  }
  componentWillMount() {
    axios.get("http://localhost:8080/web/react_chef/totalpage.do")
        .then((response)=>{
          this.setState({totalpage:response.data})
        })
    this.post();
  }
  // HTML을 만들어서 전송 => index.html <div id="root">(HTML)</div>
  render() {
    const html=this.state.chef.map((m)=>
        <table className={"table"}>
          <tr>
            <td className={"text-center"} width={"30%"} rowSpan={"2"}>
              <img src={m.poster} style={{"width":"200px","height":"80px"}}/>
            </td>
            <td colSpan={"4"} style={{"color":"orange"}}>
              <h3 onClick={this.chefDetailData.bind(this,m.chef)}>{m.chef}</h3></td>
          </tr>
          <tr>
            <td className={"text-left"}>
              <img src={"1.png"}/>{m.mc1}
            </td>
            <td className={"text-left"}>
              <img src={"3.png"}/>{m.mc3}
            </td>
            <td className={"text-left"}>
              <img src={"7.png"}/>{m.mc7}
            </td>
            <td className={"text-left"}>
              <img src={"2.png"}/>{m.mc2}
            </td>
          </tr>
        </table>
    )
     return (
         <div className={"row"}>
           <div className={"col-sm-7"}>
             <h3 className={"text-center"}>쉐프 목록</h3>
             <table className={"table"}>
               <tbody>
               <tr>
                 <td>{html}</td>
               </tr>
               </tbody>
             </table>
             <table className={"table"}>
               <tr>
                 <td className={"text-center"}>
                   <input type={"button"} onClick={this.prev}
                          value={"이전"} className={"btn btn-sm btn-info"}/>
                   {this.state.page} page / {this.state.totalpage} pages
                   <input type={"button"} onClick={this.next}
                          value={"다음"} className={"btn btn-sm btn-warning"}/>
                 </td>
               </tr>
             </table>
           </div>
           <div className={"col-sm-5"}>
               {this.state.isShow===1?<ChefDetail recipe={this.state.recipe} onFindChange={this.findChange} onBtnClick={this.chefFindData}/>:null}
           </div>
         </div>
     )
  }
}
class ChefDetail extends Component{
  constructor(props) {
      super(props);
      this.state={
          fd:'',
          chef:''
      }
      this.btnClick=this.btnClick.bind(this);
      this.fdChange=this.fdChange.bind(this);
  }
  // 상위 클래스의 함수 호출시 => 속성으로 함수명을 전송 => 하위클래스에 사용이 가능
    /*
      <ChefDetail recipe={this.state.recipe}
      onFindChange={this.findChange}
      onBtnClick={this.chefFindData}/>

     */
    btnClick()
    {
        this.props.onBtnClick();// App
    }
    fdChange(e)
    {
        this.props.onFindChange(e.target.value);// App
    }
  componentWillMount() {
      this.setState({chef:this.props.recipe.chef})
  }

    render() {
      const html=this.props.recipe.map((m)=>
          <div className="col-md-6">
              <div className="product-item">
                  <img src={m.poster} alt="Lights" style={{"width":"100%"}}/>
                  <div className="down-content">
                      <p style={{"font-size":"8pt"}}>{m.title.length>15?m.title.substring(0,15)+"...":m.title}</p>
                  </div>
              </div>
          </div>
      )
    return (
        <Fragment>
            <div style={{"height":"50px"}}></div>
            <div className={"row"}>
              <input type={"text"} className={"input-sm"} size={"20"} onChange={this.fdChange}/>
              <button className={"btn btn-sm btn-primary"} onClick={this.btnClick}>검색</button>
              <button className={"btn btn-sm btn-danger"}>전체목록</button>
            </div>
            <div style={{"height":"20px"}}></div>
            <div className={"row"}>
                {html}
            </div>
            </Fragment>
    )
  }
}
export default App;
