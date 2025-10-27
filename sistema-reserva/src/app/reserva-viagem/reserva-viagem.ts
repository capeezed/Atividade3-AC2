import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


const STORAGE_KEY = 'reservaViagemForm';

@Component({
  selector: 'app-reserva-viagem',
  standalone: false,
  templateUrl: './reserva-viagem.html',
  styleUrls: ['./reserva-viagem.css']
})
export class ReservaViagem implements OnInit, OnDestroy {
  reservaForm!: FormGroup;
  destinos = ['Paris', 'Nova York', 'Tóquio', 'Rio de Janeiro'];
  formSubscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.carregarData();
    this.configurarStorage();
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  
  validadorData: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const dataIda = control.get('dataIda')?.value;
    const dataVolta = control.get('dataVolta')?.value;

    if (!dataIda || !dataVolta) {
      return null;
    }

    const dataIdaObj = new Date(dataIda);
    const dataVoltaObj = new Date(dataVolta);

    if (dataVoltaObj <= dataIdaObj) {
      
      control.get('dataVolta')?.setErrors({ posteriorIda: true });
      return { dataInvalida: true };
    } else {
      
      const voltaControl = control.get('dataVolta');
      if (voltaControl?.hasError('posteriorIda')) {
          const errors = { ...voltaControl.errors };
          delete errors['posteriorIda'];
          voltaControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    }

    return null; 
  };

  private inicializarForm(): void {
    this.reservaForm = this.fb.group({
      destino: ['', Validators.required],
      dataIda: ['', Validators.required],
      dataVolta: ['', Validators.required],
      numPassageiros: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
      ]],
      emailContato: ['', [
        Validators.required,
        Validators.email
      ]]
    }, { validators: this.validadorData }); 
  }

  private carregarData(): void {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const formData = JSON.parse(savedData);
      
      this.reservaForm.patchValue(formData);
    }
  }
  
  private configurarStorage(): void {
    
    this.formSubscription = this.reservaForm.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
      
        if (this.reservaForm.dirty) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        }
      });
  }

  get f() {
    return this.reservaForm.controls;
  }

  onSubmit(): void {
    if (this.reservaForm.valid) {
     
      console.log('Formulário Submetido com Sucesso!', this.reservaForm.value);

      
      localStorage.removeItem(STORAGE_KEY);
      this.reservaForm.reset();
    } else {
    
      console.error('O formulário está inválido.');
      this.reservaForm.markAllAsTouched(); 
    }
  }
}

