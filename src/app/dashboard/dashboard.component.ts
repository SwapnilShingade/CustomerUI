import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../shared/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { Categories} from './catgeory-model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit{
  isLoading = false;
  customerDetailsForm: FormGroup;
  showDetails = false;
  selectedCategoryId = 0;
  categoryList: Categories[] = [{CategoryName: 'Select', Id: 0}];
  customerDetailColumns: string[] = ['Name', 'Primary Contact', 'Phone', 'City','Category'];
  customerDetail: MatTableDataSource<any>;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;  

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    public dialog: MatDialog,
  ) {
    this.customerDetail = new MatTableDataSource;
    
  }

  ngOnInit() {    
    this.customerDetailsForm = this.formBuilder.group({
      category: ['']
    });
    this.getCategories();
    this.search();
  }

  ngAfterViewInit() {
    this.customerDetail.paginator = this.matPaginator;
  }
  
  stateChange(category) {
    this.selectedCategoryId = category.value;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.customerDetail.filter = filterValue;
  }

  mapCategoryList(categoryList: any) {
     categoryList.forEach((item, i) => {
      let categoryItem: Categories = {
          CategoryName : item.categoryName,
          Id : item.categoryId
      }
      this.categoryList.push(categoryItem);
    }); 
  
  console.log("Category List", this.categoryList);
  }

  search() {
    this.isLoading = true;
    console.log("Form Selected Value", this.customerDetailsForm.value);
    
    this.customerService.getCustomers(this.selectedCategoryId == null ? 0 : this.selectedCategoryId).subscribe(async (customerData: any) => {
      this.isLoading = false;
      if (customerData != null) {
        this.showDetails = true;
        console.log("Cutomers Reveived", customerData.result);
        this.customerDetail.data = customerData.result;
      } else {
      }
    }, error => {
      this.isLoading = false;
    });

  }

  getCategories() {
    this.isLoading = true;
    console.log("Categories Master", this.customerDetailsForm.value);
   
    this.customerService.getCategories().subscribe(async (categoriesData: any) => {
      this.isLoading = false;
      if (categoriesData != null) {
        this.showDetails = true;
        console.log("Categories Reveived", categoriesData.result);
        this.mapCategoryList(categoriesData.result);    
        
      } else {
      }
    }, error => {
      this.isLoading = false;
    });

  }

}


