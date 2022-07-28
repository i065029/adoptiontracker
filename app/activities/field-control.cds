using ActivitiesService as service from '../../srv/customers-service';

annotate managed with {
  createdAt  @UI.HiddenFilter : false;
  createdBy  @UI.HiddenFilter : false;
  modifiedAt @UI.HiddenFilter : false;
  modifiedBy @UI.HiddenFilter : false;
}