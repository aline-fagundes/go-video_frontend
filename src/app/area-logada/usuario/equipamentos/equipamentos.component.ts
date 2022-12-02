import { ActivatedRoute, Router } from '@angular/router';
import { EquipamentoService } from '../../../core/services/equipamento/equipamento.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-equipamentos',
  templateUrl: './equipamentos.component.html',
  styleUrls: ['./equipamentos.component.css']
})
export class EquipamentosComponent {
  equipamentos: any = []
  equipamentosOriginal: any = []
  page: number = 0
  size: number = 12
  categoriaFiltro: Set<string> = new Set<string>()
  marcaFiltro: Set<string> = new Set<string>()
  statusFiltro: Set<string> = new Set<string>()
  paginado: boolean = true
  categoria: string = ''
  marca: string = ''
  status: string = ''
  estaVazio: boolean = true
  mensagem: string = "equipamentos"

  constructor(private service: EquipamentoService, private route: ActivatedRoute, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    var routeParams = this.route.snapshot.paramMap
    if(routeParams.get('page')!=null){
      this.page = parseInt(routeParams.get('page') || '')
    }
    if(routeParams.get('size')!=null){
      this.size = parseInt(routeParams.get('size') || '')
    }
    this.consultar()
  }

  consultar() {
    this.service.consultarPaginado(this.page, this.size).subscribe(data => {
      this.equipamentos = data
      this.categoriaFiltro = new Set(this.equipamentos.content.map((e:any)=>e.categoria))
      this.marcaFiltro = new Set(this.equipamentos.content.map((e:any)=>e.marca))
      this.statusFiltro = new Set(this.equipamentos.content.map((e:any)=>e.status))
      if(this.equipamentos.content){
        this.estaVazio = false
        this.paginado = true
      }
    })

    this.service.consultarPaginado(0,100).subscribe(data => {this.equipamentosOriginal = data;})
  }

  buscar(value: any){
    console.log(value)
    const busca = value.busca
    this.equipamentos.content = this.equipamentosOriginal.content.filter((e: any)=>{return e.modelo.toLowerCase().includes(busca.toLowerCase())})
    this.paginado = false

    if(busca == ''){
      window.location.reload()
    }
  }

  filtrarCategoria(event: any){
    this.categoria = event.target.value
    this.filtrar()
  }

  filtrarMarca(event: any){
    this.marca = event.target.value
    this.filtrar()
  }

  filtrarStatus(event: any){
    this.status = event.target.value
    this.filtrar()
  }

  filtrar(){
    let listaCategoriaFiltrada = []
    let listaMarcaFiltrada: any[] = []
    let listaStatusFiltrado: any[] = []

    if(this.marca == '' && this.categoria == '' && this.status == ''){
      window.location.reload()
    }
    else{
      this.paginado = false
      if(this.categoria!=''){
        listaCategoriaFiltrada = this.equipamentosOriginal.content.filter((e: any)=>e.categoria==this.categoria)
      }
      else{
        listaCategoriaFiltrada = this.equipamentosOriginal.content
      }
      if(this.marca!=''){
        listaMarcaFiltrada = this.equipamentosOriginal.content.filter((e: any)=>e.marca==this.marca)
      }
      if(this.status!=''){
        listaStatusFiltrado = this.equipamentosOriginal.content.filter((e: any)=>e.status==this.status)
      }

      this.equipamentos.content = listaCategoriaFiltrada.filter((e:any)=>{
        if(listaMarcaFiltrada.length==0 || listaMarcaFiltrada.includes(e)){
          if(listaStatusFiltrado.length==0 || listaStatusFiltrado.includes(e)){
            return e;
          }
        }
      })
    }

  }
  irParaProximaPagina(){
    this.router.navigate(['/equipamentos', this.page+1, 12])
  }

  irParaPaginaAnterior(){
    this.router.navigate(['/equipamentos', this.page-1, 12])
  }
}
