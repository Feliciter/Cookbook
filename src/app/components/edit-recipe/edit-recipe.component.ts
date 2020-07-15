import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { ApiService } from "./../../shared/api.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export interface Subject {
  name: string;
}

@Component({
  selector: "app-edit-recipe",
  templateUrl: "./edit-recipe.component.html",
  styleUrls: ["./edit-recipe.component.css"],
})
export class EditRecipeComponent implements OnInit {
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
    this.updateRForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private recipeApi: ApiService
  ) {
    let id = this.actRoute.snapshot.paramMap.get("id");
    this.recipeApi.GetRecipe(id).subscribe((data) => {
      this.subjectArray = data.subjects;
      this.recipeForm = this.fb.group({
        recipe_name: [data.recipe_name, [Validators.required]],
        recipe_description: [data.recipe_description, [Validators.required]],
        subjects: [data.subjects],
      });
    });
  }

  /* Reactive  form */
  updateRForm() {
    this.recipeForm = this.fb.group({
      recipe_name: ["", [Validators.required]],
      recipe_description: ["", [Validators.required]],
      subjects: [this.subjectArray],
    });
  }

  /* Add dynamic  */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim() && this.subjectArray.length < 50) {
      this.subjectArray.push({ name: value.trim() });
    }
    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  /* Remove dynamic subjects */
  remove(subject: Subject): void {
    const index = this.subjectArray.indexOf(subject);
    if (index >= 0) {
      this.subjectArray.splice(index, 1);
    }
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.recipeForm.controls[controlName].hasError(errorName);
  };

  /* Update  */
  updateRecipeForm() {
    let id = this.actRoute.snapshot.paramMap.get("id");
    if (window.confirm("Are you sure you want to update?")) {
      this.recipeApi
        .UpdateRecipe(id, this.recipeForm.value)
        .subscribe((res) => {
          this.ngZone.run(() => this.router.navigateByUrl("/recipe-list"));
        });
    }
  }

  
  deleteRecipe() {
    let id = this.actRoute.snapshot.paramMap.get("id");
    if (window.confirm("Are you sure")) {
      this.recipeApi.DeleteRecipe(id).subscribe(() => {
        this.ngZone.run(() => this.router.navigateByUrl("/recipe-list"));
      });
    }
  }
}
