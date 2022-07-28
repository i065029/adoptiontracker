/* checksum : 92eca4b3fea3de7417a7f490ef227416 */
@cds.persistence.skip : true
entity FREActivityService.FREActivities {
  key ID : UUID;
  description : LargeString;
  @cds.ambiguous : 'missing on condition?'
  domain : Association to one FREActivityService.TechnicalDomain on domain.code = domain_code;
  domain_code : Integer;
  maturity_level_min : Integer;
  maturity_level_max : Integer;
  @cds.ambiguous : 'missing on condition?'
  engagement_model : Association to one FREActivityService.EngagementModel on engagement_model.code = engagement_model_code;
  engagement_model_code : Integer;
  cost : Boolean;
  duration : LargeString;
  expected_outcome : LargeString;
  prereqs_deps : LargeString;
  @cds.ambiguous : 'missing on condition?'
  to_products : Association to many FREActivityService.ActivityProducts {  };
  @cds.ambiguous : 'missing on condition?'
  supportingteam : Association to one FREActivityService.SupportingTeams on supportingteam.ID = supportingteam_ID;
  supportingteam_ID : UUID;
  short_text : LargeString;
  person_responsible : LargeString;
  @cds.ambiguous : 'missing on condition?'
  fre_realm : Association to one FREActivityService.FRERealm on fre_realm.code = fre_realm_code;
  fre_realm_code : Integer;
  @cds.ambiguous : 'missing on condition?'
  fre_pillar : Association to one FREActivityService.FREPillar on fre_pillar.code = fre_pillar_code;
  fre_pillar_code : Integer;
  @cds.ambiguous : 'missing on condition?'
  region : Association to one FREActivityService.Regions on region.ID = region_ID;
  region_ID : UUID;
  rating : Integer;
};

@cds.persistence.skip : true
entity FREActivityService.Products {
  key ID : UUID;
  name : String(50);
  @cds.ambiguous : 'missing on condition?'
  category : Association to one FREActivityService.ProductCategories on category.ID = category_ID;
  category_ID : UUID;
  description : String(500);
};

@cds.persistence.skip : true
entity FREActivityService.ProductCategories {
  key ID : UUID;
  description : String(50);
};

@cds.persistence.skip : true
entity FREActivityService.SupportingTeams {
  key ID : UUID;
  description : LargeString;
  key_contact : LargeString;
  email : LargeString;
  how_to_engage : LargeString;
  key_links : LargeString;
};

@cds.persistence.skip : true
entity FREActivityService.Regions {
  key ID : UUID;
  name : LargeString;
};

@cds.persistence.skip : true
entity FREActivityService.TechnicalDomain {
  name : String(255);
  descr : String(1000);
  key code : Integer;
  @cds.ambiguous : 'missing on condition?'
  texts : Association to many FREActivityService.TechnicalDomain_texts {  };
  @cds.ambiguous : 'missing on condition?'
  localized : Association to one FREActivityService.TechnicalDomain_texts on localized.code = code;
};

@cds.persistence.skip : true
entity FREActivityService.EngagementModel {
  name : String(255);
  descr : String(1000);
  key code : Integer;
  @cds.ambiguous : 'missing on condition?'
  texts : Association to many FREActivityService.EngagementModel_texts {  };
  @cds.ambiguous : 'missing on condition?'
  localized : Association to one FREActivityService.EngagementModel_texts on localized.code = code;
};

@cds.persistence.skip : true
entity FREActivityService.ActivityProducts {
  @odata.precision : 7
  @odata.type : 'Edm.DateTimeOffset'
  createdAt : Timestamp;

  /**
   * {i18n>UserID.Description}
   */
  createdBy : String(255);
  @odata.precision : 7
  @odata.type : 'Edm.DateTimeOffset'
  modifiedAt : Timestamp;

  /**
   * {i18n>UserID.Description}
   */
  modifiedBy : String(255);
  key ID : UUID;
  @cds.ambiguous : 'missing on condition?'
  activity : Association to one FREActivityService.FREActivities on activity.ID = activity_ID;
  activity_ID : UUID;
  @cds.ambiguous : 'missing on condition?'
  product : Association to one FREActivityService.Products on product.ID = product_ID;
  product_ID : UUID;
};

@cds.persistence.skip : true
entity FREActivityService.FRERealm {
  name : String(255);
  descr : String(1000);
  key code : Integer;
  @cds.ambiguous : 'missing on condition?'
  texts : Association to many FREActivityService.FRERealm_texts {  };
  @cds.ambiguous : 'missing on condition?'
  localized : Association to one FREActivityService.FRERealm_texts on localized.code = code;
};

@cds.persistence.skip : true
entity FREActivityService.FREPillar {
  name : String(255);
  descr : String(1000);
  key code : Integer;
  realm : Integer;
  @cds.ambiguous : 'missing on condition?'
  texts : Association to many FREActivityService.FREPillar_texts {  };
  @cds.ambiguous : 'missing on condition?'
  localized : Association to one FREActivityService.FREPillar_texts on localized.code = code;
};

@cds.persistence.skip : true
entity FREActivityService.TechnicalDomain_texts {
  key locale : String(14);
  name : String(255);
  descr : String(1000);
  key code : Integer;
};

@cds.persistence.skip : true
entity FREActivityService.EngagementModel_texts {
  key locale : String(14);
  name : String(255);
  descr : String(1000);
  key code : Integer;
};

@cds.persistence.skip : true
entity FREActivityService.FRERealm_texts {
  key locale : String(14);
  name : String(255);
  descr : String(1000);
  key code : Integer;
};

@cds.persistence.skip : true
entity FREActivityService.FREPillar_texts {
  key locale : String(14);
  name : String(255);
  descr : String(1000);
  key code : Integer;
};

@cds.external : true
service FREActivityService {};

