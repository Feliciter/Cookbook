import { Router } from "@angular/router";
import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { ApiService } from "./../../shared/api.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export interface Subject {
  name: string;
}

@Component({
  selector: "app-add-recipe",
  templateUrl: "./add-recipe.component.html",
  styleUrls: ["./add-recipe.component.css"],
})
export class AddRecipeComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild("chipList") chipList;
  @ViewChild("resetRecipeForm") myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  recipeForm: FormGroup;
  subjectArray: Subject[] = [];
  selected = {};

  ngOnInit() {
    this.submitBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private recipeApi: ApiService
  ) {}

  /* Reactive form */
  submitBookForm() {
    this.recipeForm = this.fb.group({
      recipe_name: ["", [Validators.required]],
      recipe_description: ["", [Validators.required]],
      subjects: [this.subjectArray],
    });
  }

  /* Add dynamic languages */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || "").trim() && this.subjectArray.length < 50) {
      this.subjectArray.push({ name: value.trim() });
    }
    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.recipeForm.controls[controlName].hasError(errorName);
  };

  /* Submit book */
  submitRecipeForm() {
    if (this.recipeForm.valid) {
      this.recipeApi.AddRecipe(this.recipeForm.value).subscribe((res) => {
        this.ngZone.run(() => this.router.navigateByUrl("/recipe-list"));
      });
    }
  }
}
