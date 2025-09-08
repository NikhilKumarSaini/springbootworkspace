package com.loanorigination.repository;

import com.loanorigination.entity.Documents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentsRepository extends JpaRepository<Documents, Long> {
    // Custom queries agar future me chahiye to yaha add kar sakte
}
