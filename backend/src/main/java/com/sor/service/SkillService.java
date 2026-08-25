package com.sor.service;

import com.sor.model.Skill;
import com.sor.model.SkillOwnersResult;

public interface SkillService extends BaseEntityService<Skill> {

  SkillOwnersResult findOwners(String slug);
}
